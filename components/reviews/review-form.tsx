'use client';

import { useToast } from "@/hooks/use-toast";
import { insertReviewSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { StarIcon } from "lucide-react";
import { createUpateReview } from "@/actions/review.action";
import { useRouter } from "next/navigation";

interface IProps{
  userId:string;
  productId:string;
  onReviewSubmitted?:VoidFunction
}
const ReviewForm = ({userId,productId}:IProps) => {
  const [open,setOpen] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof insertReviewSchema>>({
    mode:'onChange',
    resolver:zodResolver(insertReviewSchema)
  });
  const {isSubmitting} = form?.formState;
  const handleOpenForm = async ()=>{
    form?.setValue("userId",userId);
    form?.setValue("productId",productId);
    setOpen(true);
  }
   const onSubmit:SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values)=>{
    try{
      const res = await createUpateReview({
        ...values,
        productId
      });
      if(!res?.success){
        toast({
          variant: "destructive",
          description: res?.message
        })
        return;
      }else{
        toast({
          title:"success",
          description: res?.message
        })
        router.refresh()
        setOpen(false);
      }
    }catch(error){
      toast({
        variant: "destructive",
        description: error instanceof Error ? error?.message : "An error occurred"
      })
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant={'default'}>Write a Review</Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>Share your thought with other customers</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form?.control}
                name="title"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a title" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="description"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                     <Textarea placeholder="Enter a description" {...field}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form?.control}
                name="rating"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field?.onChange} value={field?.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a rating"/>
                        </SelectTrigger>

                      </FormControl>
                      <SelectContent>
                        {Array.from({length:5})?.map((_,index)=>(
                          <SelectItem key={index} value={(index+1)?.toString()}>
                            {index + 1} <StarIcon className="inline h-4 w-4"/>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div> 
            <DialogFooter>
              <Button type="submit" size={"lg"} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...':'Submit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewForm