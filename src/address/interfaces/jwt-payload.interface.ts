import roleFind from "../../users/enums/roleFind.enum";

export interface JwtPayload {
  sub: number;
  name: string;
  role: roleFind;
}