import { getFeautredProducts, getLatestProducts } from "@/actions/product.action"
import DealCountdown from "@/components/deal-countdown";
import IconsBox from "@/components/icons-box";
import ProductCarousel from "@/components/shared/products/product-carousel";
import ProductList from "@/components/shared/products/product-list";
import ViewAllProducts from "@/components/view-all-products";

export const metadata = {
  title:'Home'
}

const HomePage = async () => {
  const products = await getLatestProducts();
  const featuredProducts = await getFeautredProducts();
  return (
    <div>
      {Array.isArray(featuredProducts) && featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList data={products || []} title="Newest Arrivals" limit={4}/>
      <ViewAllProducts/>
      <DealCountdown/>
      <IconsBox/>
    </div>
  )
}

export default HomePage