import type { Metadata } from "next";

import { APP_Description, APP_NAME } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/shared/Header/menu";
import MainNav from "@/components/user/main-nav";


export const metadata: Metadata = {
  title: {
    template:`%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description:  `${APP_Description}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col">
         <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-3">
            <Link href="/" className="w-22">
              <Image
                src="/images/logo.svg"
                alt="pro store logo"
                width={48}
                height={48}
                priority={true}
              />
            </Link>
            {/* main nav */}
            <MainNav className="mx-6 "/>
            <div className="ml-auto items-center flex space-x-4">
              <Menu/>
            </div>
          </div>
         </div>
         <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
         </div>
      </div>
    </>
  );
}
