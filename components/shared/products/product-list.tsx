import ProductCard from "./ProductCard";

type TProps = {
  data:any;
  title:string;
  limit?:number
}

const ProductList = ({data,title,limit}:TProps) => {
  const limitedData = limit ? data?.products?.slice(0,limit) : data?.products
  return (
    <div className="my-10">
      <h2 className="font-bold mb-4">{title}</h2>
      {data?.products?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {limitedData?.map((product:any) => (
          <ProductCard key={product?.name} product={product}/>
        ))}
        </div>
      ) :(
        <div>
          <p>No products found</p>
        </div>
      )}
    </div>
  )
}

export default ProductList