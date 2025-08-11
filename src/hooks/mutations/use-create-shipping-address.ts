import { createShippingAddress } from "@/actions/create-shipping-address";
import { shippingAddressTable } from "@/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseAddressesQueryKey } from "../queries/use-user-addresses";

export const getCreateShippingAddressMutationKey = () =>
  ["create-shipping-address"] as const;

export const useCreateShippingAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateShippingAddressMutationKey(),
    mutationFn: createShippingAddress,
    onSuccess: (created) => {
      queryClient.setQueryData(getUseAddressesQueryKey(), (old) => {
        const prev =
          (old as (typeof shippingAddressTable.$inferSelect)[]) ?? [];
        const exists = prev.some((addr) => addr.id === created.id);
        return exists ? prev : [created, ...prev];
      });
      queryClient.invalidateQueries({ queryKey: getUseAddressesQueryKey() });
    },
  });
};
