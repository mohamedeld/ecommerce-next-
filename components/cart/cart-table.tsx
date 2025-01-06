'use client';

import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
import { Button } from "../ui/button";
import { addItemToCart, deleteItemFromCart } from "@/actions/cart.action";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "@/lib/utils";

interface IProps{
  cart?:Cart;
}

const CartTable = ({cart}:IProps) => {
  const [isPending,startTransition] = useTransition();
  const {toast} = useToast();
  const router = useRouter();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart?.items.length === 0 ? (
        <div>
          Cart is empty <Link href="/">Go to shopping</Link>
        </div>
      ):(
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart?.items?.map((item)=>(
                  <TableRow key={item?.slug}>
                    <TableCell>
                      <Link href={`/product/${item?.slug}`} className="flex items-center">
                        <Image src={item?.image} alt={item?.name} width={50} height={50} className="object-cover"/>
                        <span className="px-2">{item?.name}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="flex-center gap-2">
                      <Button disabled={isPending} variant={"outline"} type="button" onClick={()=>{
                        startTransition(async ()=>{
                          // handle remove item from cart
                          const response = await deleteItemFromCart(item?.productId);
                          if(response?.success){
                            toast({
                              description:`${item?.name} removed from cart`
                            });
                          }else{
                            toast({
                              variant:'destructive',
                              description:response?.message
                            });
                          }
                        })
                      }}>
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin"/>
                        ):(
                          <Minus className="w-4 h-4"/>
                        )}
                      </Button>
                      <span>{item?.qty}</span>
                      <Button disabled={isPending} variant={"outline"} type="button" onClick={()=>{
                        startTransition(async ()=>{
                          // handle add item to cart
                          const response = await addItemToCart(item);
                          if (!response?.success) {
                            toast({
                              variant: 'destructive',
                              description: response?.message
                            });
                            return;
                          }
                  
                          // handle success add item to cart
                          toast({
                            description: `${item?.name} added to cart`
                          })
                        })
                      }}>
                        {isPending ? (
                          <Loader className="w-4 h-4 animate-spin"/>
                        ):(
                          <Plus className="w-4 h-4"/>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                      {item?.price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="pb-3 text-xl">
                Subtotal ({cart?.items?.reduce((acc,item)=>acc+item?.qty,0)})
                <span className="font-bold">
                  {formatCurrency(cart?.itemsPrice)}
                </span>
              </div>
              <Button className="w-full" disabled={isPending} onClick={()=>{
                startTransition(async ()=>{
                  router.push('/shipping-address')
                })
              }}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin"/>
                ):(
                  <ArrowRight className="w-4 h-4"/>
                )} Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

export default CartTable