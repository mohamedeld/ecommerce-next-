'use client';

import { useToast } from "@/hooks/use-toast";
import { updateProfileSchmea } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { updateUserProfile } from "@/actions/user.action";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const ProfileForm = () => {
  const { data: session, update } = useSession();
  const router = useRouter();
  const form = useForm<z.infer<typeof updateProfileSchmea>>({
    resolver: zodResolver(updateProfileSchmea),
    defaultValues: {
      name: session?.user?.name ?? "",
      email: session?.user?.email ?? ""
    }
  })

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof updateProfileSchmea>) {
    const res = await updateUserProfile(values);
    if (!res?.success) {
      return toast({
        variant: 'destructive',
        description: res?.message
      })
    }
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values?.name,
        email: values?.email
      }
    }
    await update(newSession);
    router.refresh();
    toast({
      description: res?.message
    })
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-5 " onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form?.control}
            name='email'
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input disabled placeholder="Email address" className="input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form?.control}
            name='name'
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Full Name" className="input-field" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size={"lg"} className="button col-span-2 w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm