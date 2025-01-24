import { getProductById } from "@/actions/product.action"
import ProductForm from "@/components/product-form"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata:Metadata = {
  title:"Product Update",
}


const ProductUpdatePage = async ({params}:{
  params:Promise<{
    id:string
  }>
}) => {
  const {id} = await params;
  const product = await getProductById(id);
  if(!product){
    return notFound();
  }
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm type="edit" product={product} productId={product?.id}/>
    </div>
  )
}

export default ProductUpdatePage