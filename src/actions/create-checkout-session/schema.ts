import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  orderId: z.uuid(),
});

export type createCheckoutSessionSchema = z.infer<
  typeof createCheckoutSessionSchema
>;
