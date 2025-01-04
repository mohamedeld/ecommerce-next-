import { auth } from "@/auth"
import SignUpForm from "@/components/shared/auth/sign-up-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata:Metadata = {
  title:"Sign up"
}

interface IProps{
  searchParams:Promise<{
    callbackUrl:string;
  }>
}

const SignupPage = async ({searchParams}:IProps) => {
  const {callbackUrl} = await searchParams;
  const session = await auth();
  if(session){
    return redirect(callbackUrl || '/');
  }

  return (
    <div className='w-full max-w-md mx-auto !h-[100vh]'>
      <Card>
        <CardHeader className='space-y-4'>
          <Link href='/' className='flex-center'>
            <Image
              src='/images/logo.svg'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className='text-center'>Register</CardTitle>
          <CardDescription className='text-center'>
            Register your account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignupPage