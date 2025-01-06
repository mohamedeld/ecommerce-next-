'use client';
import { addItemToCart, deleteItemFromCart } from "@/actions/cart.action";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Cart, CartItem } from "@/types"
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps{
  item:CartItem;
  cart?:Cart;
}

const AddToCart = ({item,cart}:IProps) => {
  const {toast} =useToast();
  const router = useRouter();
  

  const handleAddToCart = async ()=>{
    const response = await addItemToCart(item);
    if(!response?.success){
      toast({
        variant:'destructive',
        description:response?.message
      });
      return;
    }

    // handle success add item to cart
    toast({
      description:`${item?.name} added to cart`,
      action:(
        <ToastAction className="bg-primary text-white hover:bg-gray-800" altText="Go To Cart" onClick={()=> router.push("/cart")}>
          Go To Cart
        </ToastAction>
      )
    })
  }
  const handleRemoveItemFromCart = async ()=> {
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
  } 
  const existItem = cart?.items?.find((x)=>x?.productId === item?.productId);

  {
   return existItem? (
      <div>
        <Button type="button" variant={"outline"} onClick={handleRemoveItemFromCart}>
          <Minus className="w-4 h-4"/>
        </Button>
        <span className="px-2">{existItem?.qty}</span>
        <Button type="button" variant={"outline"} onClick={handleAddToCart}>
          <Plus className="w-4 h-4"/>
        </Button>
      </div>
    ):
    (
     <Button className="w-full" type="button" onClick={handleAddToCart}><Plus/> AddToCart</Button>
   )
  }
}

export default AddToCart