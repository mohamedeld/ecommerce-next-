import { getLatestProducts } from "@/actions/product.action"
import ProductList from "@/components/shared/products/product-list"

export const metadata = {
  title:'Home'
}

const HomePage = async () => {
  const products = await getLatestProducts();
  
  return (
    <div>
      <ProductList data={products || []} title="Newest Arrivals" limit={4}/>
    </div>
  )
}

export default HomePage