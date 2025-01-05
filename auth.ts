import NextAuth from "next-auth";
import {prisma} from "./db/initDB";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials"
import { compareSync } from "bcrypt-ts-edge";
import type {NextAuthConfig} from "next-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const config = {
  pages:{
    signIn:'/sign-in',
    error:'/sign-in',
  },
  session:{
    strategy:'jwt',
    maxAge:30*24*60*60,
  },
  secret:process.env.AUTH_SECRET,
  adapter:PrismaAdapter(prisma),
  providers:[
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "mohamed@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(credentials === null){
          console.log("No credentials provided");
          return null;
        }
        const user = await prisma.user.findFirst({
          where:{
            email:credentials?.email as string,
          }
        });
        
        if(user && user?.password){
          const isMatch = compareSync(credentials?.password as string,user?.password);
          if(isMatch){
            return{
              id:user?.id,
              name:user?.name,
              email:user?.email,
              role:user?.role
            }
          }
        }
        return null;
      }
    })
  ],
  callbacks:{
    async session({ session, user,trigger, token }:any) {
      session.user.id = token?.sub;
      session.user.role = token?.role;
      session.user.name = token?.name;
      if(trigger === "update"){
        session.user.name = user?.name
      }
      return session
    },
    async jwt({token,user,trigger,session}:any){
      if(user){
        token.role = user?.role;
      }
      if(user?.name === "NO_NAME"){
        token.name = user?.email?.split('@')[0]
      }
      await prisma.user.update({
        where:{
          id:user?.id
        },
        data:{
          name:token.name
        }
      })
      return token;
    },
    authorized({request,auth}:any){
      if(request?.cookies?.get("sessionCartId")){
        // generate new session cart id
        const sessionCartId = crypto.randomUUID();
        // clone request headers 
        const newRequestHeader = new Headers(request?.headers);
        // create new response and add new headers
        const response = NextResponse.next({
          request:{
            headers:newRequestHeader
          }
        });

        // set newly generated sessionCartId
        response.cookies.set("sessionCartId",sessionCartId);
        return response;
      }else{  
        return true;
      }
    }
  }
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth }  = NextAuth(config)