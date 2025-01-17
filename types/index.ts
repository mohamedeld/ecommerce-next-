import { cartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema, paymentResultSchema, shippingAddressSchema } from "@/lib/validator";
import z from "zod";

export type Cart = z.infer<typeof insertCartSchema>; 
export type CartItem = z.infer<typeof cartItemSchema>; 


export type ShippingAddressType = z.infer<typeof shippingAddressSchema>

export type OrderType = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItemType[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;


export type OrderItemType = z.infer<typeof insertOrderItemSchema> & {
  id:string;
  createdAt:Date;
  isPaid:boolean;
  paidAt:Date | null;
  isDelivered:boolean;
  deliveredAt:Date | null;
  orderItems:OrderItemType[];
  user:{
    name:string;
    email:string;
  }
};