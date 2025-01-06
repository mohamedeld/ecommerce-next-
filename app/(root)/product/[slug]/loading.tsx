import Image from 'next/image'
import loader from '@/public/assets/loader.gif'

const Loading = () => {
  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <Image src={loader} alt='loader image' height={150} width={150}/>
    </div>
  )
}

export default Loading