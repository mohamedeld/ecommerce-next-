import { getProduct } from "@/actions/product.action";
import ProductImages from "@/components/shared/products/product-images";
import ProductPrice from "@/components/shared/products/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { notFound } from "next/navigation";


interface IParams {
  params:Promise<{
    slug:string;
  }>
}
const ProductDetailPage = async ({params}:IParams) => {
  const {slug} = await params;
  if(!slug){
    notFound();
  }
  const product = await getProduct(slug);
  if(!product){
    notFound();
  }
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* images */}
          <div className="col-span-2">
            <ProductImages images={product?.images}/>
          </div>
            {/* details */}
            <div className="col-span-2 p-5">
              <div className="flex flex-col gap-6">
                <p>{product?.brand} {product?.category}</p>
                <h1 className="h3-bold">{product?.name}</h1>
                <p>{Number(product?.rating)} of {product?.numReviews} Reviews</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 ">
                  <ProductPrice value={Number(product?.price)} className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"/>
                </div>
              </div>
              <div className="mt-10">
                <p className="font-semibold">Description</p>
                <p>{product?.description}</p>
              </div>
            </div>
            {/* action column */}
            <div>
              <Card>
                <CardContent className="p-4">
                  <div className="mb-2 flex justify-between">
                    <div>Price</div>
                    <div>
                      <ProductPrice value={Number(product?.price)}/>
                    </div>
                  </div>
                  <div className="mb-2 flex justify-between">
                    <div>Status</div>
                    {product?.stock > 0 ? (
                      <Badge variant={"outline"}>In Stock</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Out of Stock</Badge>
                    )}
                  </div>
                  <div>
                  {product?.stock > 0 && (
                    <div className="flex-center">
                      <Button className="w-full">Add to cart</Button>
                    </div>
                  )}
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </section>
    </>
  )
}

export default ProductDetailPage