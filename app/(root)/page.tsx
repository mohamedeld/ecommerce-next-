import ProductList from "@/components/shared/products/product-list"
import sampleData from "@/lib/sample-data"

export const metadata = {
  title:'Home'
}

const HomePage = () => {
  return (
    <div>
      <ProductList data={sampleData} title="Newest Arrivals" limit={4}/>
    </div>
  )
}

export default HomePage