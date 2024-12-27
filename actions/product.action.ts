'use server';

import prisma from "@/db/initDB";

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