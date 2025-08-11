import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-cart";
import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";

export const getDecreaseProductFromCartMutationKey = (cartItemId: string) =>
  ["decrease-cart-product-quantity"] as const;

export const useDecreaseProduct = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDecreaseProductFromCartMutationKey(cartItemId),
    mutationFn: () => decreaseCartProductQuantity({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getUseCartQueryKey() });
    },
  });
};
