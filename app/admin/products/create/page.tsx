import ProductForm from "@/components/product-form"
import { Metadata } from "next"

export const metadata:Metadata = {
  title:'create product'
}


const CreateProductPage = () => {
  return (
    <>
      <h2 className="h2-bold">
      Create Product
      </h2>
      <div className="my-8">
        <ProductForm type="create"/>
      </div>
    </>
  )
}

export default CreateProductPage