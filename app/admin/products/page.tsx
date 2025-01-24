import { deleteProduct, getAllProducts } from "@/actions/product.action";
import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";

interface IProps{
  searchParams:Promise<{
    page:string;
    query:string;
    category:string;
  }>
}

const ProductsPage = async ({searchParams}:IProps) => {
  const {page,query,category} = await searchParams;
  const currentPage = Number(page) || 1;
  const searchText = query || "";
  const selectedCategory = category || "";
  const products = await getAllProducts({page: currentPage, limit: 10, query: searchText, category: selectedCategory});
  
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
        <Button asChild variant={"default"}>
          <Link href="/admin/products/create">Create Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>RATING</TableHead>
            <TableHead className="w-[100px]">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.data?.map(product=>(
            <TableRow key={product?.id}>
              <TableCell>{formatId(product?.id)}</TableCell>
              <TableCell>{product?.name}</TableCell>
              <TableCell className="text-right">{formatCurrency(Number(product?.price))}</TableCell>
              <TableCell>{product?.category}</TableCell>
              <TableCell>{product?.stock}</TableCell>
              <TableCell>{Number(product?.rating)}</TableCell>
              <TableCell className="flex gap-2">
                <Button asChild variant={"outline"} size="sm">
                  <Link href={`/admin/products/${product?.id}`}>Edit</Link>
                </Button>
                {/* Delte */}
                <DeleteDialog id={product?.id} action={deleteProduct}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {products?.totalPages && products?.totalPages > 1 && <Pagination page={currentPage} totalPages={products?.totalPages}/>}
    </div>
  )
}

export default ProductsPage