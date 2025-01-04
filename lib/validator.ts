import {z} from 'zod'
import { formatNumberWithDecimal } from './utils'

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
  price:currency
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
