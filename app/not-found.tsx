'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  const handlePush = ()=>{
    router.push('/')
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Image src="/images/logo.svg" alt="404" height={48} width={48} priority={true}/>
      <div className="p-6 rounded-lg shadow-md tex-center w-1/3">
        <h1 className="text-3xl font-bold mb-4">Not Found</h1>
        <p className="text-destructive">Could not found requested page</p>
        <Button variant={"outline"} className="mt-4 ml-2" onClick={handlePush}>Back to home</Button>
      </div>
    </div>
  )
}

export default NotFound