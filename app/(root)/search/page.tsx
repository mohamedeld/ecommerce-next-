import { getAllProducts } from "@/actions/product.action";
import ProductCard from "@/components/shared/products/ProductCard";

const SearchPage = async ({searchParams}:{
  searchParams:Promise<{
    category?:string;
    q?:string;
    sort?:string;
    price?:string;
    page?:string;
    rating?:string;
  }>
}) => {
  const {category='all',q='all',sort='newest',price='all',page='1',rating='all'} = await searchParams;
  
  const products = await getAllProducts({
    page:Number(page),
    query:q,
    category,
    sort,
    price,
    rating
  })


  const getFilterUrl = ({
    c,s,p,r,pg
  }:{c?:string,s?:string,p?:string,r?:string,pg?:string}) => {
    const params = {q,category,sort,price,page,rating};
    if(c){
      params.category = c;
    }
    if(s){
      params.sort = s;
    }
    if(p){
      params.price = p;
    }
    if(r){
      params.rating = r;
    }
    if(pg){
      params.page = pg;
    }
    return `/search?${new URLSearchParams(params).toString()}`
  }

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* filter */}
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {
            (products?.data?.length ?? 0) > 0 ? products?.data?.map(product => (
              <ProductCard  key={product?.id} product={product}/>
            )) : <div>No products found</div>
          }
        </div>
      </div>
    </div>
  )
}

export default SearchPage