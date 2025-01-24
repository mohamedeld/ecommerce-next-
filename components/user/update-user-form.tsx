'use client';

import { updateUserSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { updateUser } from "@/actions/user.action";
import { useRouter } from "next/navigation";

const UpdateUserForm = ({
  user, userId
}: { user: User, userId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user
  })



  const onSubmit: SubmitHandler<z.infer<typeof updateUserSchema>> = async (data) => {
    try {
      const res = await updateUser(userId, data);
      if (!res.success) {
        toast({
          variant: "destructive",
          description: res?.message
        })

      } else {
        toast({
          description:res?.message
        })
        form.reset();
        router.push("/admin/users");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error?.message : "something went wrong"
      })
    }
  }

  const { isSubmitting } = form?.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'email'> }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input disabled placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        </div>
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'name'> }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'role'> }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select value={field?.value?.toString()} onValueChange={field?.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {USER_ROLES?.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-between mt-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Update User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default UpdateUserForm