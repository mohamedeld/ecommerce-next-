'use server';

import { auth } from "@/auth";
import { prisma } from "@/db/initDB";
import { formatError } from "@/lib/constants/utils";
import { insertReviewSchema } from "@/lib/validator";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export async function createUpateReview(data:z.infer<typeof insertReviewSchema>){
  try{
    const session = await auth();
    if(!session){
      throw new Error("User is not signed in")
    }

    const review = insertReviewSchema.parse({
      ...data,
      userId:session?.user?.id
    });
    const product = await prisma.product.findFirst({
      where:{
        id:review?.productId
      }
    })
    if(!product){
      throw new Error("Product not found")
    }
    const reviewExist = await prisma.review.findFirst({
      where:{
        productId:review?.productId,
        userId:review?.userId
      }
    })
    await prisma.$transaction(async(tx)=>{
      if(reviewExist){
        await tx.review.update({
          where:{
            id:reviewExist?.id
          },
          data:{
            title:review?.title,
            description:review?.description,
            rating:review?.rating
          }
        })
      }else{
        await tx.review.create({
          data:review
        })
      }
      // get avg rating
      const avgRating = await tx.review.aggregate({
        _avg:{rating:true},
        where:{
          productId:review?.productId
        }
      })
      const numsOfReviews = await tx.review.count({
        where:{
          productId:review?.productId
        }
      });
      await tx.product.update({
        where:{
          id:review?.productId
        },
        data:{
          rating:avgRating?._avg?.rating || 0,
          numReviews:numsOfReviews
        }
      })
    });
    revalidatePath(`/product/${product?.slug}`);
    return {
      success:true,
      message:"Review updated successfully"
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

export async function GetReviews(productId:string){
  try{
    const reviews = await prisma.review.findMany({
      where:{
        productId,
      },
      include:{
        user:{
          select:{
            name:true
          }
        }
      },
      orderBy:{
        createdAt:'desc'
      }
    });
    return {
      reviews
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


export async function getReview(productId:string){
  try{
    const session = await auth();
    if(!session){
      throw new Error("user is not found");
    }
    const review = await prisma.review.findFirst({
      where:{
        productId,
        userId:session?.user?.id
      }
    })
    return review;
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