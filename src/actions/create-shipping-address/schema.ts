import z from "zod";

export const createShippingAddressSchema = z.object({
  recipientName: z.string().min(1),
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  neighborhood: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
  email: z.email(),
  cpfOrCnpj: z.string().min(1),
});

export type CreateShippingAddressSchema = z.infer<
  typeof createShippingAddressSchema
>;
