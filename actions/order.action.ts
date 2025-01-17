"use server";

import { auth } from "@/auth";
import { formatError } from "@/lib/constants/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { getUserById } from "./user.action";
import { getMyCart } from "./cart.action";
import { insertOrderSchema } from "@/lib/validator";
import { prisma } from "@/db/initDB";
import { CartItem } from "@/types";
import { convertToPlainObject } from "@/lib/utils";

export async function createOrder() {
  try {
    const session = await auth();
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error("user not found");
    }
    const user = await getUserById(userId);
    if(!cart || cart?.items?.length === 0){
      return{
        success:false,
        message:"your cart is empty",
        redirectTo:"/cart"
      }

      }
      if(!user?.address){
        return{
          success:false,
          message:"No shipping address",
          redirectTo:"/shipping-address"
        }
      }
      if(!user?.paymentMethod){
        return{
          success:false,
          message:"No payment method provided",
          redirectTo:"/payment-method"
        }
      }
      
      const order = insertOrderSchema.parse({
        userId:user?.id,
        shippingAddress:user?.address,
        paymentMethod:user?.paymentMethod,
        itemsPrice:cart?.itemsPrice,
        
        taxPrice:cart?.taxPrice,
        shippingPrice:cart?.shippingPrice,
        totalPrice:cart?.totalPrice,
      })
      const insertedOrderId = await prisma.$transaction(async(tx)=>{
        const insertedOrder = await tx.order.create({
          data:order
        })
        for(const item of cart?.items as CartItem[]){
          await tx.orderItem.create({
            data:{
              ...item,
              price:item?.price,
              orderId:insertedOrder?.id
            }
          })
        }
        // clear the cart
        await tx.cart.update({
          where:{
            id:cart?.id
          },
          data:{
            items:[],
            totalPrice:0,
            taxPrice:0,
            itemsPrice:0,
            shippingPrice:0,
           
          }
        })
        return insertedOrder?.id;
      });
      if(!insertedOrderId){
        throw new Error("order is not created");
      }
      console.log("oder" ,insertedOrderId)
      return {
        success:true,
        message:"Order created successfully",
        redirectTo:`/order/${insertedOrderId}`
      }
  } catch (error) {
    console.log("error ",error)
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}


export async function getOrderById(orderId:string){
  try{
    if(!orderId){
      throw new Error("Please provide order id")
    }
    const data = await prisma.order.findFirst({
      where:{
        id:orderId
      },
      include:{
        OrderItem:true,
        user:{
          select:{
            name:true,
            email:true
          }
        }
      }
    })
  return convertToPlainObject(data);
  }catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}