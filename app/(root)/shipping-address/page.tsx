import { getMyCart } from "@/actions/cart.action";
import { getUserById } from "@/actions/user.action";
import { auth } from "@/auth"
import ShippingAddressForm from "@/components/shipping/ShippingAddressForm";
import { ShippingAddressType } from "@/types";
import { Metadata } from "next"
import { redirect } from "next/navigation";

export const metadata:Metadata = {
  title:'Shipping address'
}

const ShippingAddressPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  if(!userId){
    throw new Error("No user id");
  }
  const user = await getUserById(userId);
  const cart = await getMyCart();
  if(!cart || cart?.items?.length === 0){
    redirect("/cart");

  }
  return (
    <>
      <ShippingAddressForm address={user?.address as ShippingAddressType}/>
    </>
  )
}

export default ShippingAddressPage