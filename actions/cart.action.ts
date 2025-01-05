'use server';

import { auth } from "@/auth";
import { formatError } from "@/lib/constants/utils";
import { CartItem } from "@/types";
import { cookies } from "next/headers";


export async function addItemToCart(data:CartItem){
  try{  
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId){
      throw new Error("Cart session not found");
    }
    const session = await auth();
    const userId = session?.user?.id ? (session?.user?.id as string) : undefined;
    

    return {
      success:true,
      message:'Item added to cart'
    }

  }catch(error){
    console.log("cart",error);
    return {
      success:false,
      message:formatError(error) || "Item does not add to cart"
    }
  }
}