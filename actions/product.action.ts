'use server';

import {prisma} from "@/db/initDB";
import { formatError } from "@/lib/constants/utils";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

export async function getAllProducts({page,limit,query,category}:{page:string,limit?:number,query:string,category?:string}){
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