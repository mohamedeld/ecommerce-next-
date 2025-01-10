'use client';

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { paymentMethodSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserPaymentMethod } from "@/actions/user.action";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PAYMENT_METHODS } from "@/lib/constants";

interface IProps{
  preferredPaymentMethod:string | number;
}
const PaymentMethodForm = ({preferredPaymentMethod}:IProps) => {
  const router = useRouter();
  const {toast} = useToast();
  const [isPending,startTransition] = useTransition();
  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver:zodResolver(paymentMethodSchema),
    mode:'onChange'
  })

  async function onSubmit(values:z.infer<typeof paymentMethodSchema>){
      startTransition(async()=>{
        const response = await updateUserPaymentMethod(values);
        if(!response?.success){
          toast({
            variant:"destructive",
            description:response?.message
          })
          return;
        }
        router.push("/place-order")
      })
    
  }

  return (
    <>
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="h2-bold mt-4">
      Payment Method
      </h1>
      <p className="text-sm text-muted-foreground">please select a payment method</p>
      <Form {...form}>
        <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex  flex-col gap-5">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  
                  <FormControl>
                    <RadioGroup onValueChange={field?.onChange} className="flex flex-col space-y-2">
                      {PAYMENT_METHODS?.map(item=>(
                        <FormItem key={item} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={item} checked={field?.value === item} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
           
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {
                isPending ? (
                  <Loader className="w-4 h-4 animate-spin"/>
                ):(
                  <>
                    <ArrowRight className="w-4 h-4"/> Continue
                  </>
                )
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>

  </>
  )
}

export default PaymentMethodForm