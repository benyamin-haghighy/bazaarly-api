import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { JwtPayload } from '../tickets/interfaces/jwtpayload.interface';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus } from '../orders/enum/order-status.enum';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { payment } from './enums/payment.enum';
import { PaymentCallbackDto } from './dto/payment-callback.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly configService: ConfigService,
    private readonly orderService: OrdersService,
  ) { }
  async create(createPaymentDto: CreatePaymentDto, user: JwtPayload) {
    const isPayment = await this.paymentRepository.findOne({
      where: {
        user_id: user.sub,
        order_id: createPaymentDto.order_id,
        status: payment.SUCCESS
      }
    })
    if (isPayment) {
      throw new BadRequestException("ان پرداخت قبلا با موفقیت انجام شده است")
    }
    const order = await this.orderRepository.findOne({
      where: {
        id: createPaymentDto.order_id,
        user_id: user.sub,
        status: OrderStatus.PENDING
      }
    })
    if (!order) {
      throw new NotFoundException('سفارشی برای پرداخت یافت نشد')
    }
    let response
    try {
      response = await axios.post('https://gateway.zibal.ir/v1/request', {
        "merchant": this.configService.getOrThrow('MERCHANT'),
        "amount": order.total_price,
        "callbackUrl": this.configService.getOrThrow('CALLBACK_URL')
      })
    } catch (error) {
      throw new ServiceUnavailableException('مشکلی در برقراری ارتباط با درگاه پرداخت به وجود امد ')
    }
    if (Number(response.data.result) !== 100) {
      throw new ServiceUnavailableException('مشکلی در ایجاد لینک پرداخت به وجود امد ')
    }
    let pay = this.paymentRepository.create({
      order_id: order.id,
      user_id: user.sub,
      amount: order.total_price,
      track_id: response.data.trackId
    })
    pay = await this.paymentRepository.save(pay)
    return { payment_url: `https://gateway.zibal.ir/start/${response.data.trackId}` }
  }
  async verify(paymentDetail: PaymentCallbackDto) {
    const isPayment = await this.paymentRepository.findOne({
      where: {
        track_id: paymentDetail.trackId
      }
    })
    if (!isPayment) {
      throw new NotFoundException("پرداختی برای تایید ان پیدا نشده است ")
    }
    if (isPayment.status !== payment.PENDING) {
      return { message: 'این پرداخت قبلاً بررسی شده است', status: isPayment.status }
    }
    if (paymentDetail.success === 0) {
      await this.update(isPayment.track_id, payment.FAILED)
      return { message: 'پرداخت ناموفق بود و سفارش لغو شد' }
    }
    let response
    try {
      response = await axios.post(this.configService.getOrThrow('VERIFY_URL'), {
        merchant: this.configService.getOrThrow('MERCHANT'),
        trackId: isPayment.track_id,
      })
    } catch (error) {
      throw new ServiceUnavailableException('مشکلی در برقراری ارتباط با درگاه پرداخت به وجود آمد')
    }

    if (Number(response.data.status) === 3) {
      await this.update(isPayment.track_id, payment.FAILED)
      return { message: 'پرداخت لغو شد و سفارش لغو شد' }
    }

    const result = Number(response.data.result)

    if (result === 100 || result === 201) {
      const paidAt = response.data.paidAt ? new Date(response.data.paidAt) : new Date()
      await this.update(
        isPayment.track_id,
        payment.SUCCESS,
        paidAt,
        String(response.data.refNumber),
      )
      return { message: 'پرداخت موفقیت‌آمیز بود' }
    }
    if (result === 202) {
      await this.update(isPayment.track_id, payment.FAILED)
      return { message: 'پرداخت موفقیت‌آمیز نبود و سفارش لغو شد' }
    }
    throw new ServiceUnavailableException(`تأیید پرداخت ممکن نشد (کد ${result})`)
  }
  async update(trackId: number, status: payment, paid_at?: Date, ref_id?: string) {
  const pay = await this.paymentRepository.findOne({
    where: { track_id: trackId },
    relations: { user: true },
  })
  if (!pay) {
    throw new NotFoundException('پرداختی وجود ندارد')
  }

  if (status === payment.SUCCESS) {
    if (!paid_at) {
      throw new InternalServerErrorException('مشکلی در تکمیل پرداخت به وجود آمد')
    }

    await this.orderRepository.update(
      { id: pay.order_id, status: OrderStatus.PENDING },
      { status: OrderStatus.PAID, paid_at },
    )

    pay.status = status
    pay.pay_at = paid_at
    pay.ref_id = ref_id ?? null
    await this.paymentRepository.save(pay)
  } else {
    pay.status = status
    await this.paymentRepository.save(pay)

    await this.orderService.cancleOrder(pay.order_id, {
      sub: pay.user.id,
      name: pay.user.name,
      role: pay.user.role,
    })
  }
}
}
