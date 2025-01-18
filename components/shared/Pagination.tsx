'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationType = {
  page:string | number;
  totalPages:number;
  urlParamsPage?:string;
}

const Pagination = ({page,totalPages,urlParamsPage}:PaginationType) => {
  const searchParams = useSearchParams();
  const router= useRouter();
  const handleClick=(btnType:string) =>{
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = formUrlQuery({
      params:searchParams.toString(),
      key:urlParamsPage || 'page',
      value:pageValue?.toString()
    })
    router.push(newUrl)

  }
  return (
    <div className="flex gap-2">
      <Button size={"lg"} variant={"outline"} className="w-28" disabled={Number(page) <= 1} onClick={()=> handleClick('prev')}>Previos</Button>

      <Button size={"lg"} variant={"outline"} className="w-28" disabled={Number(page) >= totalPages} onClick={()=> handleClick('next')}>Next</Button>
    </div>
  )
}

export default Pagination