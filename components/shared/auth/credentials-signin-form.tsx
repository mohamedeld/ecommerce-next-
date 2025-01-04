'use client';

import { signInWithCredentials } from "@/actions/user.action";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useActionState } from "react";
import CustomButton from "./CustomButton";

const CredentialsSignInForm = () => {
  const [data,action] = useActionState(signInWithCredentials,{
    success:false,
    message:''
  })

  

  return (
    <form action={action}>
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={''}/>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" defaultValue={''}/>
        </div>
        <div>
          <CustomButton text="Sign In" className="w-full" variant={'default'}/>
        </div>
        {
          data && !data?.success && (
            <div className="text-center text-destructive">{data?.message}</div>
          )
        }
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href='/sign-up' target="_self" className="link">Sign Up</Link>
        </div>
      </div>
    </form>
  )
}

export default CredentialsSignInForm