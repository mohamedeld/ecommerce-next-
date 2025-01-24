'use client';
import { useToast } from "@/hooks/use-toast";
import { insertProductSchema, updateProductSchema } from "@/lib/validator";
import slugify from "slugify";
import { zodResolver } from "@hookform/resolvers/zod";
import { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createProduct, updateProduct } from "@/actions/product.action";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { Checkbox } from "./ui/checkbox";

interface IProps {
  type: "create" | "edit";
  product?: Product;
  productId?: string;
}
const ProductForm = ({ type, product, productId }: IProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertProductSchema>>({
    defaultValues: {
      name: product?.name || "",
      price: String(product?.price) || "0",
      stock: product?.stock || 0,
      category: product?.category || "",
      description: product?.description || "",
      brand: product?.brand || "",
      banner: product?.banner || "",
      slug: product?.slug || "",
      isFeatured: product?.isFeatured || false,
      images: Array.isArray(product?.images) ? product?.images : [],
    },
    resolver: type === "create" ? zodResolver(insertProductSchema) : zodResolver(updateProductSchema)
  })

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (data) => {
    try {
      if (type === 'create') {
        const res = await createProduct(data);
        if (!res?.success) {
          toast({
            variant: "destructive",
            description: res?.message
          })
        } else {
          toast({

            description: res?.message
          })
          router.push("/admin/products");
        }

      }
      if (type === 'edit') {
        if (!productId) {
          throw new Error("Product ID is missing");
        }
        const res = await updateProduct(productId, { ...data, id: productId });
        if (!res?.success) {
          toast({
            variant: "destructive",
            description: res?.message
          })
        } else {
          toast({
            description: res?.message
          })
          router.push("/admin/products");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error?.message : "An error occurred"
      })
    }
  }
  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-5">
          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'> }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'> }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className="relative ">
                    <Input placeholder="Enter slug" {...field} />
                    <Button type="button" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 mt-2" onClick={() => {
                      form.setValue('slug', slugify(form.getValues('name'), { lower: true }))
                    }}>Generate</Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          {/* category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'category'> }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'brand'> }) => (
              <FormItem className="w-full">
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <FormField
            control={form.control}
            name="price"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'price'> }) => (
              <FormItem className="w-full">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'stock'> }) => (
              <FormItem className="w-full">
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product stock" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field flex flex-col md:flex-row gap-5">
          {/* images */}
          <FormField
            control={form.control}
            name="images"
            render={() => (
              <FormItem className="w-full">
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className="space-y-2 mt-2 min-h-48">
                    <div className="flex-start space-x-2">
                      {images?.map((image) => (
                        <Image
                          src={image}
                          key={image}
                          alt="product image"
                          className="w-20 h-20 object-cover object-center rounded-sm"
                          width={100}
                          height={100}
                        />
                      ))}
                      <FormControl>
                        <UploadButton endpoint={"imageUploader"} onClientUploadComplete={(res: { url: string; }[]) => {
                          form.setValue('images', [...images, res[0]?.url])
                        }} onUploadError={(error: Error) => {
                          toast({
                            variant: "destructive",
                            description: error?.message
                          })
                        }} />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="upload-field">
          Featured Product
          <Card>
            <CardContent className="space-y-2 mt-2">
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'isFeatured'> }) => (
                  <FormItem className="space-x-2 items-center">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                  </FormItem>
                )}
              />
              {isFeatured && banner && <Image src={banner} alt="banner image" className="w-full object-cover object-center rounded-sm" width={1920} height={680} />}
              {isFeatured && !banner && <UploadButton endpoint={"imageUploader"} onClientUploadComplete={(res: { url: string; }[]) => {
                form.setValue('banner', res[0]?.url)
              }} onUploadError={(error: Error) => {
                toast({
                  variant: "destructive",
                  description: error?.message
                })
              }} />}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }: { field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'description'> }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter product description" {...field} className="resize-no" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          {/* submit */}
          <Button type="submit" size={"lg"} disabled={form.formState.isSubmitting} className="button col-span-2 w-full">
            {form.formState.isSubmitting ? "Submitting..." : type === "create" ? "Create Product" : "Update Product"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm