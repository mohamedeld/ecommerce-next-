import sampleData from "@/lib/sample-data";
import prisma from "./initDB";

async function main(){
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data:sampleData?.products
  })
}

main();