import { PickType } from "@nestjs/mapped-types";
import { CreateBasketDto } from "./create-basket.dto";

export class UpdateBasketDto extends PickType(CreateBasketDto, ['product_id', 'quantity'] as const) {}