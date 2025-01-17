import { getOrderById } from "@/actions/order.action";
import OrderDetailsTable from "@/components/order-details-table";
import { ShippingAddressType } from "@/types";
import { Metadata } from "next"
import { notFound } from "next/navigation";

export const metadata:Metadata = {
  title :"Order detail"
}

const OrderDetailPage = async ({params}:{params:Promise<{id:string}>}) => {
  const {id} = await params;
  const order = await getOrderById(id);
  if (!order) {
    notFound();
  }
  return (
    <OrderDetailsTable order={order}/>
  )
}

export default OrderDetailPage