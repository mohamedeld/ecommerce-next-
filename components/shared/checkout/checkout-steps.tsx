import { cn } from "@/lib/utils";
import React from "react";

const items = [
  'User Login',
  'Shipping Address',
  'Payment Method',
  'Place order'
];


const CheckoutSteps = ({current = 0}) => {
  return (
    <div className="flex jutify-between flex-col md:flex-row space-x-2 space-y-2 mb-10">
      {items?.map((item,index)=>(
        <React.Fragment key={item}>
          <div className={cn(
            "p-2 w-56 rounded-full text-center text-sm",
            index === current ? 'bg-secondary':''
          )}>
            {item}
          </div>
          {item !== "Place Order" && (
            <hr className="w-16 border-t border-gray-300 mx-2 "/>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default CheckoutSteps