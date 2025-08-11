import { getUserAddresses } from "@/actions/get-user-addresses";
import { shippingAddressTable } from "@/db/schema";
import { useQuery } from "@tanstack/react-query";

export const getUseAddressesQueryKey = () => ["shipping-addresses"] as const;

export const useUserAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUseAddressesQueryKey(),
    queryFn: getUserAddresses,
    initialData: params?.initialData,
  });
};
