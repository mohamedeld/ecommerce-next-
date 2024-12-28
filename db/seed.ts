import sampleData from "@/lib/sample-data";
import prisma from "./initDB";

async function main(){
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.session.deleteMany();

  await prisma.product.createMany({
    data:sampleData?.products
  })
  await prisma.user.createMany({
    data:sampleData?.users
  })
}

main();