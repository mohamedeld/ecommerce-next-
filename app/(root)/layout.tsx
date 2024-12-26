import Footer from "@/components/shared/footer"
import Header from "@/components/shared/Header"

interface RootLayoutProps {
  children: React.ReactNode
}

function RootLayout({children}:Readonly<RootLayoutProps>){
  return (
    <div className="flex flex-col h-screen">
      <Header/>
      <main className="flex-1 wrapper">
        {children}
      </main>
      <Footer/>
    </div>
  )
}

export default RootLayout