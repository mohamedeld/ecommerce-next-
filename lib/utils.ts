import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function convertToPlainObject<T>(value:T):T{
  return JSON.parse(JSON.stringify(value))
}

export function formatNumberWithDecimal(num:number):string{
  const [int,decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2,'0')}` : `${int}.00`
}


export function round2(value:number | string){
  if(typeof value === 'number'){
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }else if(typeof value === 'string'){
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  }else{
    throw new Error("Value is not a number or string");
  }
}

export const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2
})

//Format currency using the currency formatter
export function formatCurrency(amount:number|string):string{
  if(typeof amount === 'number'){
    return CURRENCY_FORMATTER.format(amount);
  }else if(typeof amount === 'string'){
    return CURRENCY_FORMATTER.format(Number(amount));
  }else{
    return 'NaN';
  }
}