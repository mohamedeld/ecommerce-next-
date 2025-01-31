import { getAllCategories, getAllProducts } from "@/actions/product.action";
import ProductCard from "@/components/shared/products/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $100',
    value: '51-100',
  },
  {
    name: '$101 to $200',
    value: '101-200',
  },
  {
    name: '$201 to $500',
    value: '201-500',
  },
  {
    name: '$501 to $1000',
    value: '501-1000',
  },
];

const ratings = [4, 3, 2, 1];
const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

interface IProps{
  params:Promise<{
    category:string;
      q:string;
  
      price:string;
    rating:string;
  }>
}

export async function generateMetadata({params}:IProps){
  const {category='all',q='all',price='all',rating='all'} = await params;
  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet =
    category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}

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
    const categories = await getAllCategories()
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
        <div className="text-xl mb-2 mt-3">Department</div>
        <div>
        <ul className="space-y-1">
          <li>
            <Link href={getFilterUrl({c:'all'})} className={`${(category === 'all' || category === '') && 'font-bold'}`}>Any</Link>
          </li>
          {Array.isArray(categories) && categories?.map(item=>(
            <li key={item?.category}>
              <Link className={`${category === item?.category && 'font-bold'}`} href={`${getFilterUrl({c:item?.category})}`}>{item?.category}</Link>
            </li>
          ))}
        </ul>
        </div>
        <div className="text-xl mb-2 mt-8">Price</div>
        <div>
        <ul className="space-y-1">
          <li>
            <Link href={getFilterUrl({p:'all'})} className={`${(price === 'all') && 'font-bold'}`}>Any</Link>
          </li>
          {Array.isArray(prices) && prices?.map(item=>(
            <li key={item?.value}>
              <Link className={`${price === item?.value && 'font-bold'}`} href={`${getFilterUrl({p:item?.value})}`}>{item?.name}</Link>
            </li>
          ))}
        </ul>
        </div>
        <div className="text-xl mb-2 mt-8">Customer Ratings</div>
        <div>
        <ul className="space-y-1">
          <li>
            <Link href={getFilterUrl({r:'all'})} className={`${(rating === 'all') && 'font-bold'}`}>Any</Link>
          </li>
          {Array.isArray(ratings) && ratings?.map(item=>(
            <li key={item}>
              <Link className={`${rating === item?.toString() && 'font-bold'}`} href={`${getFilterUrl({r:`${item}`})}`}>{`${item} stars & up`}</Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {(q !== "all" && q !== '') && `Query ${q}` }{" "}
            {(category !== "all" && category !== '') && `Category ${category} ` } {" "}
            {(price !== "all" && price !== '') && `Price ${price}` }{" "}
            {(rating !== "all" && rating !== '') && `Rating ${rating}&stars & up` }{" "}
            {
            (q !== 'all' && q !== '' ) || 
            (category !== 'all' && category !== '' ) || 
            (price !== 'all' ) || 
            (rating !== 'all'  ) ? (
              <Button variant={"link"}>
                <Link href={"/search"}>Clear</Link>
              </Button>
            ):(
              null
            )
            }
          </div>
          <div>
            {/* sort */}
            Sort By {" "}
            {sortOrders?.map(item=>(
              <Link key={item} href={getFilterUrl({s:item})} className={`mx-2 ${sort === item} && font-bold`}>{item}</Link>
            ))}
          </div>
        </div>
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