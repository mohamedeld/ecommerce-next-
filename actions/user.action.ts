'use server';

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "@/lib/validator";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signInWithCredentials(prevState:unknown,formData:FormData){
  try{
    const user =signInFormSchema.parse({
      email:formData.get('email') as string,
      password:formData.get('password') as string
    })
    await signIn("credentials",user);
    return {
      success:true,
      message:"Signed in successfully"
    }
  }catch(error){
    if(isRedirectError(error)){
      throw error;
    }
    return {
      success:false,
      message:error instanceof Error ? error?.message : 'something went wrong'
    }
  }
}

export async function signOutUser(){
  await signOut();
}