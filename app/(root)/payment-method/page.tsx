import { getUserById } from "@/actions/user.action";
import { auth } from "@/auth"
import PaymentMethodForm from "@/components/payment-method/payment-method-form";
import CheckoutSteps from "@/components/shared/checkout/checkout-steps";
import { Metadata } from "next"

export const metadata:Metadata = {
  title:"select payment method"
}

const PaymentMethodPage = async () => {
  const session = await auth();
  const userId =session?.user?.id;
  if(!userId){
    throw new Error("user not found");
  }
  const user = await getUserById(userId);
  
  return (
    <>
    <CheckoutSteps current={2}/>
      <PaymentMethodForm preferredPaymentMethod={user?.paymentMethod ?? ''}/>
      
    </>
  )
}

export default PaymentMethodPage