import { getCategories } from "@/actions/get-categories";
import { categoryTable } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export const getUseCategoriesQueryKey = () => ["categories"] as const;

export const useCategories = (params?: {
  initialData?: (typeof categoryTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUseCategoriesQueryKey(),
    queryFn: getCategories,
    initialData: params?.initialData,
  });
};


