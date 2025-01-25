import { getAllCategories } from "@/actions/product.action"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Button } from "../ui/button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const CategoryDrawer = async () => {
  const categories = await getAllCategories();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MenuIcon/>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Select a category</DrawerTitle>
          <DrawerDescription>All Categories select any one you want</DrawerDescription>
          <div className="space-y-1 mt-4">
            {Array.isArray(categories) ? categories.map(x => (
              <Button variant="ghost" className="flex w-full justify-start" key={x?.category} asChild>
                <DrawerClose asChild>
                  <Link
                  href={`/search?category=${x?.category}`}
                  >{x?.category} ({x?._count})</Link>
                </DrawerClose>
              </Button>
            )) : null}
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  )
}

export default CategoryDrawer