import { formatDateTime, formatId } from "@/lib/utils"
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { OrderItemType } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface IProps{
  order:any;
 
}

const OrderDetailsTable = ({order}:IProps) => {
  
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order?.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto">
        <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Payment Method</h2>
              <p>{order?.paymentMethod}</p>
              {
                order?.isPaid  ? (
                  <Badge variant={"secondary"}>
                    Paid at {formatDateTime(order?.paidAt)?.dateTime}
                  </Badge>
                    )
                  : (
                    <Badge variant={"destructive"}>
                      Not Paid
                    </Badge>
                  )
              }
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Shipping Address</h2>
              <p>{order?.shippingAddress?.fullName}</p>
              <p>{order?.shippingAddress?.streetAddress}</p>
              {
                order?.isDelivered  ? (
                  <Badge variant={"secondary"}>
                    Paid at {formatDateTime(order?.paidAt)?.dateTime}
                  </Badge>
                    )
                  : (
                    <Badge variant={"destructive"}>
                      Not Paid
                    </Badge>
                  )
              }
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.OrderItem?.map((item:OrderItemType)=>(
                    <TableRow key={item?.slug}>
                      <TableCell>
                        <Link href={`/product/${item?.slug}`} className="flex items-center">
                          <Image src={item?.image} alt={item?.slug} width={50} height={50} className="object-cover"/>
                          <span className="px-2">{item?.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                      <span className="px-2">{item?.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                      ${item?.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OrderDetailsTable