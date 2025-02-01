'use client';
import { ReviewType } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import ReviewForm from './review-form';
import { GetReviews } from '@/actions/review.action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Calendar, User } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from './Rating';
interface IProps{
  userId:string;
  productId:string;
  productSlug:string;
  
}
const ReviewList = ({userId,
  productId,productSlug
}:IProps) => {
  const [reviews,setReviews] = useState<ReviewType[]>([]);


  useEffect(()=>{
    const loadReviews = async ()=>{
      const res = await GetReviews(productId);
        setReviews(res?.reviews || []);
      
    }
    loadReviews();
  },[productId])

  return (
    <div className='space-y-4'>
      {reviews?.length === 0 && <div>No Reviews yet</div>}
      {
        userId ? (
          <>
            {/* Review form */}
            <ReviewForm userId={userId} productId={productId} />
          </>
        ):(
          <div>
            Please <Link className="text-blue-700 px-2 " href={`/sign-in?.callbackUrl=/product/${productSlug}`}>Sign in</Link>
             to write a review
          </div>
        )
      }
      <div className="flex flex-col gap-3">
        {/* Reviews */}
        {reviews?.map(review=>(
          <Card key={review?.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review?.title}</CardTitle>
              </div>
              <CardDescription>
                {review?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review?.rating}/>
                <div className="flex items-center">
                  <User className='mr-1 h-3 w-3 '/>
                  {review?.user ? review?.user?.name : 'Deleted user'}
                </div>
                <div className="flex items-center">
                  <Calendar className='mr-1 h-3 w-3'/>
                  {formatDateTime(review?.createdAt)?.dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ReviewList