
interface RootLayoutProps {
  children: React.ReactNode
}

function RootLayout({children}:Readonly<RootLayoutProps>){
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 wrapper">
        {children}
      </main>
    </div>
  )
}

export default RootLayout