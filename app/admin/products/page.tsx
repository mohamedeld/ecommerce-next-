import { getAllProducts } from "@/actions/product.action";

interface IProps{
  searchParams:Promise<{
    page:string;
    query:string;
    category:string;
  }>
}

const ProductsPage = async ({searchParams}:IProps) => {
  const {page,query,category} = await searchParams;
  const products = await getAllProducts({page,limit:10,query,category});
  
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
      </div>
    </div>
  )
}

export default ProductsPage