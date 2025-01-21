'use client';

import { useState, useTransition } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface IProps{
  id:string;
  action:(id:string)=> Promise<{message:string,success:boolean}>
}

const DeleteDialog = ({id,action}:IProps) => {
  const [open,setOpen] = useState(false);
  const [isPending,setTransition] = useTransition();
  const { toast } = useToast();
  async function handleDeleteClick(){
    setTransition(async()=>{
      const res = await action(id);
      if(!res?.success){
        toast({
          variant:'destructive',
          description:res?.message
        })
      }else{
        setOpen(false);
        toast({
          description:res?.message
        })
      }
    })
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size={"sm"} variant={"destructive"} className="ml-2">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action can not be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button size={"sm"} variant={"destructive"} disabled={isPending} onClick={handleDeleteClick}>
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog