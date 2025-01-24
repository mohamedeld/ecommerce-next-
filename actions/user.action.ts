'use server';
import { auth, signIn, signOut } from "@/auth";
import {prisma} from "@/db/initDB";
import { formatError } from "@/lib/constants/utils";
import { paymentMethodSchema, shippingAddressSchema, signInFormSchema, signUpFormSchema, updateUserSchema } from "@/lib/validator";
import { ShippingAddressType } from "@/types";
import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt-ts-edge";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
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


export const getUserById = async (userId:string)=>{
  const user = await prisma.user.findFirst({
    where:{
      id:userId
    }
  })
  if(!user){
    throw new Error("User not found");
  }
  return user;
}


export async function updateUserAddress(data:ShippingAddressType){
  try{
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where:{
        id:session?.user?.id
      }
    })
    if(!currentUser){
      throw new Error("user not found");
    }
    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where:{
        id:currentUser?.id
      },
      data:{
        address
      }
    })
    return {
      success:true,
      message:'User updated successfully'
    }
  }catch(error){
    return {
      success:false,
      message:formatError(error) || "Can not update user address"
    }
  }
}


// update user's payment 
export async function updateUserPaymentMethod(data:z.infer<typeof paymentMethodSchema>){
  try{
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where:{
        id:session?.user?.id
      }
    })
    if(!currentUser){
      throw new Error("User not found");
    }
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where:{
        id:currentUser?.id
      },
      data:{
        paymentMethod:paymentMethod.type
      }
    })
    return {
      success:true,
      message:"User updated successfully"
    }
  }catch(error){
    return { 
      success:false,
      message:formatError(error) || "Can not update user payment"
    }
  }
}

export  const updateUserProfile = async(user:{name:string,email:string})=>{
try{
  const session = await auth();
  if(!session){
    throw new Error("please login.")
  }
  const currentUser = await prisma.user.findFirst({
    where:{
      id:session?.user?.id
    }
  })
  if(!currentUser){
    throw new Error("user not found");
  }
  await prisma.user.update({
    where:{
      id:currentUser?.id
    },
    data:{
      name:user?.name,
      email:user?.email
    }
  })
  return{
    success:true,
    message:"User updated successfully"
  }
}catch(error){
  return { 
    success:false,
    message:formatError(error) || "Can not update user profile"
  }
}
}


export async function getAllUser({limit=10,page,query}:{limit?:number,page:number,query:string}){
  try{
    const queryFilter:Prisma.OrderWhereInput = query && query !== 'all' ? {
          user:{
            name:{
              contain:query,
              mode:'insensitive',
            }as Prisma.StringFilter
          }
        } : {}
    const users = await prisma.user.findMany({
      where:{
        ...queryFilter
      },
      orderBy:{createdAt:"desc"},
      skip:(page-1) * limit,
      take:limit
    })
    const userCount = await prisma.user.count();
    return {
      data:users,
      totalPages:Math.ceil(userCount / limit)
    }
  }catch(error){
    return { 
      success:false,
      message:formatError(error) || "Can not update user payment"
    }
  }
}

export async function deleteUser(id:string){
  try{
    await prisma.user.delete({
      where:{
        id
      }
    });
    revalidatePath("/admin/users");
    return {
      success:true,
      message:"User deleted successfully"
    }
  }catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateUser(id:string,data:z.infer<typeof updateUserSchema>){
  try{
    const user = await prisma.user.findFirst({
      where:{
        id
      }
    });
    if(!user){
      throw new Error("User not found");
    }
    await prisma.user.update({
      where:{
        id
      },
      data
    })
    revalidatePath("/admin/users");
    return {
      success:true,
      message:"User updated successfully"
    }
  }catch(error){
    return { 
      success:false,
      message:formatError(error) || "Can not update user"
    }
  }
}