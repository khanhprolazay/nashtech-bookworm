import { Injectable } from "@nestjs/common";
import { Promotion } from "@prisma/client";
import { BaseService } from "src/core/service/base.service";

@Injectable()
export class PromotionService extends BaseService<Promotion> {
  model() {
    return this.client.promotion;
  }

  
}