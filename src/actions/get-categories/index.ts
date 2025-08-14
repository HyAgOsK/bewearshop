"use server";

import { db } from "@/db";
import { getCategoriesSchema } from "./schema";

export const getCategories = async () => {
  getCategoriesSchema.parse({});
  const categories = await db.query.categoryTable.findMany({});
  return categories;
};


