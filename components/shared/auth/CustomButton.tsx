'use client';

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";

interface IProps{
  text:string;
  className?:string;
  variant?:"default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const CustomButton = ({text,className,variant}:IProps) => {
  const {pending} = useFormStatus();
  return (
    <Button disabled={pending} className={className} variant={variant}>
      {pending ? (
        <>
          <Loader className="w-4 h-4 animate-spin"/>
          {text}...
        </>
      ):text}
    </Button>
  )
}

export default CustomButton