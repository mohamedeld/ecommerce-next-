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