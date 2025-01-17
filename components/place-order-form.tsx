'use client';

import { createOrder } from "@/actions/order.action";
import {  useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import PlaceOrderBtn from "./place-order-btn";

const PlaceOrderForm = () => {
  const router = useRouter();
  const { toast } = useToast()
  const handleSubmit = async (event:React.FormEvent)=>{
    try{
      event.preventDefault();
      const res = await createOrder();
      if(res?.success && res?.redirectTo){
        router.push(res?.redirectTo);
      }else{
        toast({
          description:res?.message,
        })
        if(res?.redirectTo){
          router.push(res?.redirectTo);
        }
      }
    }catch(error){
      toast({
        description:error instanceof Error ? error?.message : "Something went wrong"
      })
    }
  }
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <PlaceOrderBtn />
    </form>
  )
}

export default PlaceOrderForm