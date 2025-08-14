import "server-only";
import { db } from "@/db";
import { productTable } from "@/db/schema";
import { desc } from "drizzle-orm";

{
  /*interface Product {
  id: string;
  name: string;
  description: string;
  prince: number;
  image: string;
  category: string;
  createdAt: Date;
*/
}

export const getProductsWithVariants = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  return products;
};

export const getNewlyCreatedProducts = async () => {
  const products = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  return products;
};
