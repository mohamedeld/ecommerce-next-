import { getMyCart } from "@/actions/cart.action"
import CartTable from "@/components/cart/cart-table"

export const metadata={
  title:"Shopping Cart",
}


const CartPage = async () => {
  const cart = await getMyCart();
   
  return (
    <div>
      <CartTable cart={cart}/>
    </div>
  )
}

export default CartPage