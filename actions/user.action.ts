'use server';
import { signIn, signOut } from "@/auth";
import {prisma} from "@/db/initDB";
import { formatError } from "@/lib/constants/utils";
import { signInFormSchema, signUpFormSchema } from "@/lib/validator";
import { hashSync } from "bcrypt-ts-edge";
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
    console.log("signin ",error)
    if(isRedirectError(error)){
      throw error;
    }
    return {
      success:false,
      message:"Invalid email or password"
    }
  }
}

export async function signOutUser(){
  await signOut();
}


export async function singupUser(prevState:unknown,formData:FormData){
  try{
    const user = await signUpFormSchema.parse({
      name:formData.get("name") as string,
      email:formData.get("email") as string,
      password:formData.get("password") as string,
      confirmPassword:formData.get("confirmPassword") as string,
    })
    const plainPassword = user?.password;
    user.password = await hashSync(user?.password,10);
    await prisma.user.create({
      data:{
        name:user?.name,
        email:user?.email,
        password:user?.password,
      }
    });
    await signIn("credentials",{
      email:user?.email,
      password:plainPassword
    })
    return {
      success:true,
      message:"User registered successfully"
    }
  }catch(error:unknown){
    console.log("error ",error)
    if(isRedirectError(error)){
      throw error;
    }
    return {
      success:false,
      message:formatError(error) || "User was not registered"
    }
  }
}