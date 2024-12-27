'use client';

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface IProps{
  images:string[];
}
const ProductImages = ({images}:IProps) => {
  const [current,setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image src={images[current]} alt={"product image"} width={1000} height={1000} className="object-cover min-h-[300px] object-center"/>
      <div className="flex">
        {images?.length > 0 && images?.map((image:string,index)=>{
          return (
            <div key={image} className={
              cn(
                "border mr-2 cursor-pointer hover:border-orange-600",
                current === index && "border-orange-500"
              )
            } onClick={()=>setCurrent(index)}>
              <Image src={image} alt={"image product"} width={100} height={100} className="object-cover object-center"/>
          </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductImages