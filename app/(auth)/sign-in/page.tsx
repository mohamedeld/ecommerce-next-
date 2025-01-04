import { auth } from "@/auth"
import CredentialsSignInForm from "@/components/shared/auth/credentials-signin-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { APP_NAME } from "@/lib/constants"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

interface IProps{
  searchParams:Promise<{
    callbackUrl:string;
  }>
}

const SignInPage =async  ({searchParams}: IProps) => {
  const {callbackUrl} = await searchParams;
  const session = await auth();
  if(session){
    return redirect(callbackUrl || "/")
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
          <CardTitle className='text-center'>Sign In</CardTitle>
          <CardDescription className='text-center'>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage