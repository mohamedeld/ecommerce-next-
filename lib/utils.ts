import { clsx, type ClassValue } from "clsx"
import queryString from 'query-string';
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

export function formatId(id:string){
  return `..${id?.substring(id?.length - 6)}`;
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'en-US',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'en-US',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'en-US',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

// Form the pagination links
export function formUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) {
  const query = queryString.parse(params);

  if (value === null) {
    delete query[key];
  } else {
    query[key] = value;
  }

  return queryString.stringify(
    {
      url: window.location.pathname,
      query,
    },
    {
      skipNull: true,
    }
  );
}