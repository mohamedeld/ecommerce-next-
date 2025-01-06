'use server';

import { auth } from "@/auth";
import { prisma } from "@/db/initDB";
import { formatError } from "@/lib/constants/utils";
import { convertToPlainObject, round2 } from "@/lib/utils";
import { cartItemSchema, insertCartSchema } from "@/lib/validator";
import { CartItem } from "@/types";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";


const calcPrice = (items:CartItem[])=>{
  const itemsPrice = round2(
    items?.reduce((acc,item)=> acc + Number(item?.price) * item?.qty,0)
  );
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return {
    itemsPrice:itemsPrice?.toFixed(2),
    shippingPrice:shippingPrice?.toFixed(2),
    taxPrice:taxPrice?.toFixed(2),
    totalPrice:totalPrice?.toFixed(2)
  }
}


export async function addItemToCart(data:CartItem){
  try{  
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId){
      throw new Error("Cart session not found");
    }
    const session = await auth();
    const userId = session?.user?.id ? (session?.user?.id as string) : undefined;
    
    const cart = await getMyCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where:{
        id:item?.productId
      }
    })
    if(!product){
      throw new Error("product not found")
    }
    if(!cart){
      const newCart = insertCartSchema.parse({
        userId:userId,
        items:[item],
        sessionCartId:sessionCartId,
        ...calcPrice([item])
      });
      await prisma.cart.create({
        data:newCart
      });
      revalidatePath(`/product/${product?.slug}`)
      return {
        success:true,
        message:'Item added to cart'
      }
    }else{
      const existItem = (cart?.items as CartItem[])?.find((x)=>x?.productId === item?.productId);
      if(existItem){
        // check stock 
        if(product?.stock < existItem?.qty + 1){
          throw new Error("Not enough stock")
        }

        const cartItem = (cart?.items as CartItem[])?.find((x)=>x?.productId === item?.productId);
        if (cartItem) {
          cartItem.qty = existItem?.qty + 1;
        }
      }else{
        if(product?.stock < 1){
          throw new Error("Not enough stock")
        }
        cart?.items?.push(item);
      }
      // update cart in database
      await prisma.cart.update({
        where: {
          id: cart?.id
        },
        data: {
          items: cart?.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart?.items as CartItem[])
        }
      });
      revalidatePath(`/product/${product?.slug}`);
      return {
        success:true,
        message:`${product?.name} ${existItem ? 'updated in':'added to'} cart`
      }
    }
  }catch(error){
    console.log("cart",error);
    return {
      success:false,
      message:formatError(error) || "Item does not add to cart"
    }
  }
}

export async function getMyCart(){
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId){
      throw new Error("Cart session not found");
    }
    const session = await auth();
    const userId = session?.user?.id ? (session?.user?.id as string) : undefined;

    const cart = await prisma.cart.findFirst({
      where:userId ? {
        userId:userId
      }: {sessionCartId:sessionCartId}
    })
    if(!cart){
      return undefined;
    }
    return convertToPlainObject({
      ...cart,
      items: cart?.items as CartItem[],
      itemsPrice:cart?.itemsPrice?.toString(),
      totalPrice:cart?.totalPrice?.toString(),
      shippingPrice:cart?.shippingPrice?.toString(),
      taxPrice:cart?.taxPrice?.toString(),

    })

} 


export async function deleteItemFromCart(productId:string){
  try{
    const sessionCartId = (await cookies())?.get('sessionCartId')?.value;
    if(!sessionCartId){
      throw new Error("Cart session not found");
    }
    const product = await prisma.product.findFirst({
      where:{
        id:productId
      }
    })
    if(!product){
      throw new Error("Product not found")
    }
    const cart = await getMyCart();
    if(!cart){
      throw new Error("Cart not found")
    }
    const exist = (cart?.items as CartItem[])?.find((x)=>x?.productId === productId);
    if(!exist){
      throw new Error("Item not found in cart")
    }
    if(exist?.qty  === 1){
      cart.items = (cart?.items as CartItem[])?.filter((x)=>x?.productId !== productId);
    }else{
      (cart?.items as CartItem[])?.find((x)=>{
        if(x?.productId === productId){
          x.qty = x?.qty - 1;
        }
      })
    }
    await prisma.cart.update({
      where:{
        id:cart?.id
      },
      data:{
        items:cart?.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart?.items as CartItem[])
      }
    })
    revalidatePath(`/product/${product?.slug}`);
    return {
      success:true,
      message:`${product?.name} was removed from cart`
    }
  }catch(error){
    return{
      success:false,
      message:formatError(error) || "Item does not delete from cart"
    }
  }

}