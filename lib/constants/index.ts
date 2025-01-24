export const APP_NAME= process.env.NEXT_PUBLIC_APP_NAME || "Prostore";
export const APP_Description= process.env.NEXT_PUBLIC_APP_Description || "Modern ecommerce store built with Next.js";

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS?.split(', ') : ['PayPal','Stripe','CashOnDelivery'];

export const DEAULT_PAYMENT_METHOD = process.env.DEAULT_PAYMENT_METHOD || 'PayPal'


export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES?.split(', ') : ['user','admin'];