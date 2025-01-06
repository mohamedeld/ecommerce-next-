'use client';

import { useToast } from "@/hooks/use-toast";
import { shippingAddressSchema } from "@/lib/validator";
import { ShippingAddressType } from "@/types";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowRight, Loader } from "lucide-react";
import { updateUserAddress } from "@/actions/user.action";

interface IProps {
  address: ShippingAddressType
}
const ShippingAddressForm = ({ address }: IProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    mode: 'onChange',
    resolver: zodResolver(shippingAddressSchema),
    defaultValues:address
  })
  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: z.infer<typeof shippingAddressSchema>) {
    startTransition(async()=>{
      const response = await updateUserAddress(values);
      if(!response?.success){
        toast({
          variant:"destructive",
          description:response?.message
        })
        return;
      }
      router.push("/payment-method")
    })
  }
  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">
          Shipping Address
        </h1>
        <p className="text-sm text-muted-foreground">Please enter an address to ship to</p>
        <Form {...form}>
          <form method="post" className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="streetAddress"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Street address</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your lantitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input placeholder="please enter your longitude" {...field} />
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
                    <ArrowRight className="w-4 h-4"/>
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

export default ShippingAddressForm