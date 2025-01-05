'use client';
import { addItemToCart } from "@/actions/cart.action";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "@/types"
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps{
  item:CartItem;
}

const AddToCart = ({item}:IProps) => {
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
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}><Plus/> AddToCart</Button>
  )
}

export default AddToCart