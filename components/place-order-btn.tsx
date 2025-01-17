'use client';
import {  useFormStatus } from 'react-dom'
import { Button } from './ui/button';
import { Check, Loader } from 'lucide-react';

const PlaceOrderBtn = () => {
  const {pending} = useFormStatus();
  return (
    <Button disabled={pending} className='w-full'>
      {pending ? (
        <Loader className='w-4 h-4 animate-spin'/>
      ):(
        <Check className="w-4 h-4"/> 
      )}
      {' '} Place order
    </Button>
  )
}

export default PlaceOrderBtn