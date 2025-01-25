import { APP_NAME } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from './menu'
import CategoryDrawer from '../category-drawer'

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex-between'>
        <div className='flex-start'>
          <CategoryDrawer/>
          <Link href="/" className='flex-start'>
            <Image src="/images/logo.svg" alt="prostore logo" width={48} height={48} priority={true}/>
            <span className='hidden lg:block font-bold text-2xl ml-3 '>{APP_NAME}</span>
          </Link>
        </div>
        <div className="space-x-2">
          <Menu/>
        </div>
      </div>
    </header>
  )
}

export default Header