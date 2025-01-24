'use server';

import {prisma} from "@/db/initDB";
import { formatError } from "@/lib/constants/utils";
import { convertToPlainObject } from "@/lib/utils";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export async function getLatestProducts(){
  try{
    const products = await prisma.product.findMany({
      take:4,
      orderBy:{
        createdAt:'desc'
      }
    })
    return products;
  }catch(error){
    console.log(error);
  }
}
export async function getProduct(slug:string){
  try{
    if(!slug){
      throw new Error("Slug is required");
    }
    const product = await prisma.product.findFirst({
      where:{
        slug
      }
    })
    return product;
  }catch(error){
    console.log(error);
  }
}


export async function getProductById(id:string){
  try{
    if(!id){
      throw new Error("id is required");
    }
    const product = await prisma.product.findFirst({
      where:{
        id
      }
    })
    return convertToPlainObject(product);
  }catch(error){
    console.log(error);
  }
}

export async function getAllProducts({page,limit,query,category}:{page:number,limit?:number,query:string,category?:string}){
  try{
    const data = await prisma.product.findMany({
      skip:(Number(page)-1) * (limit ?? 10),
      take:limit ?? 10,
    })
    const dataCount = await prisma.product.count();
    return {
      data,
      totalPages:Math.ceil(dataCount / (limit ?? 10))
    }
  }catch(error){
    if (isRedirectError(error)) {
          throw error;
        }
        return {
          success: false,
          message: formatError(error),
        };
      }
  }


  export async function deleteProduct(id:string){
    try{

      if(!id){
        throw new Error("Id is required");
      }
      const productExists = await prisma.product.findFirst({
        where:{
          id
        }
      })
      if(!productExists){
        throw new Error("Product not found");
      }
       await prisma.product.delete({
        where:{
          id
        }
      })
      revalidatePath("/admin/products");
      return {
        success:true,
        message:"Product deleted successfully"
      }
    }catch(error){
    if (isRedirectError(error)) {
          throw error;
        }
        return {
          success: false,
          message: formatError(error),
        };
      }
  }


export async function createProduct(data:z.infer<typeof insertProductSchema>){
  try{
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data:product
    })
    revalidatePath("/admin/products");
    return {
      success:true,
      message:"Product created successfully"
    }
  }catch(error){
    if (isRedirectError(error)) {
          throw error;
        }
        return {
          success: false,
          message: formatError(error),
        };
      }
}
export async function updateProduct(id:string,data:z.infer<typeof updateProductSchema>){
  try{
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where:{
        id
      }
    });
    if(!productExists){
      throw new Error("Product not found");
    }
    await prisma.product.update({
      where:{
        id
      },
      data:product
    })
    revalidatePath("/admin/products");
    return {
      success:true,
      message:"Product updated successfully"
    }
  }catch(error){
    if (isRedirectError(error)) {
          throw error;
        }
        return {
          success: false,
          message: formatError(error),
        };
      }
}