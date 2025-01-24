import {z} from 'zod'
import { formatNumberWithDecimal } from './utils'
import { PAYMENT_METHODS } from './constants'

export const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),{
  message:"Price must have exactly two decimal places"
})

export const insertProductSchema = z.object({
  name: z.string().min(3,{message:'Name must be at least 3 characters'}),
  slug: z.string().min(3,{message:'slug must be at least 3 characters'}),
  category: z.string().min(3,{message:'category must be at least 3 characters'}),
  brand: z.string().min(3,{message:'brand must be at least 3 characters'}),
  description: z.string().min(3,{message:'description must be at least 3 characters'}),
  stock:z.coerce.number(),
  images:z.array(z.string()).min(1,{message:'At least one image is required'}),
  isFeatured:z.boolean(),
  banner:z.string().nullable(),
  price:currency,
  
})

export const updateProductSchema = insertProductSchema?.extend({
  id:z.string().min(1,{message:"Product id is required"})
})


export const signInFormSchema = z.object({
  email:z.string().email("Invalid email address"),
  password:z.string().min(6,{message:"Password must be at least 6 characters"})
})
export const signUpFormSchema = z.object({
  name:z.string().min(1,"name is required"),
  email:z.string().email("Invalid email address"),
  password:z.string().min(6,{message:"Password must be at least 6 characters"}),
  confirmPassword:z.string().min(6,{message:"confirm Password must be at least 6 characters"})
}).refine((data)=> data?.password === data?.confirmPassword,{
  message:"Password do not match",
  path:['confirmPassword']
})


// cart
export const cartItemSchema = z.object({
  productId:z.string().min(1,"Product is required"),
  name : z.string().min(1,"Name is required"),
  slug : z.string().min(1,"Slug is required"),
  qty : z.number().int().nonnegative("Quantity must be a positive number"),
  image : z.string().min(1,"Image is required"),
  price:currency,
})

export const insertCartSchema = z.object({
  items:z.array(cartItemSchema),
  itemsPrice:currency,
  totalPrice:currency,
  shippingPrice:currency,
  taxPrice:currency,
  sessionCartId:z.string().min(1,"Session cart id is required"),
  userId:z.string().optional().nullable()
})


export const shippingAddressSchema = z.object({
  fullName: z.string().min(1,"Full name is required") ,
  streetAddress:z.string().min(1,"Address is required"),
  city:z.string().min(1,"City is required"),
  postalCode:z.string().min(1,"Postal code is required"),
  country:z.string().min(1,"Country is required"),
  lat:z.coerce.number().optional(),
  lng:z.coerce.number().optional()
})

export const paymentMethodSchema = z.object({
  type:z.string().min(1,{message:"Payment method is required"})
}).refine((data)=> PAYMENT_METHODS?.includes(data?.type),{
  path:['type'],
  message:"Invalid payment method"
});


// schema for inserting order
export const insertOrderSchema = z.object({
  userId:z.string().min(1,{message:"user is required"}),
  itemsPrice:currency,
  shippingPrice:currency,
  taxPrice:currency,
  totalPrice:currency,
  paymentMethod:z.string().refine((data)=> PAYMENT_METHODS?.includes(data),{
    message:"Invalid payment method"
  }),
  shippingAddress:shippingAddressSchema
})

// Schema for the PayPal paymentResult
export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});


// schema for inserting an order item
export const insertOrderItemSchema = z.object({
  productId:z.string(),
  slug:z.string(),
  image:z.string(),
  name:z.string(),
  price:currency,
  qty:z.number(),
})

export const updateProfileSchmea = z.object({
  name:z.string().min(3,{message:"minmum characters should be 3"}),
  email:z.string().email({message:"enter a valid email"}),
})