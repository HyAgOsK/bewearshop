"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import {
  type CreateShippingAddressSchema,
  createShippingAddressSchema,
} from "./schema";
import { revalidatePath } from "next/cache";

export const createShippingAddress = async (
  data: CreateShippingAddressSchema,
) => {
  const parsed = createShippingAddressSchema.parse(data);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const [created] = await db
    .insert(shippingAddressTable)
    .values({
      userId: session.user.id,
      recipientName: parsed.recipientName,
      street: parsed.street,
      number: parsed.number,
      complement: parsed.complement ?? null,
      city: parsed.city,
      state: parsed.state,
      neighborhood: parsed.neighborhood,
      zipCode: parsed.zipCode,
      country: parsed.country,
      phone: parsed.phone,
      email: parsed.email,
      cpfOrCnpj: parsed.cpfOrCnpj,
    })
    .returning();

  revalidatePath("/cart/identification");
  return created;
};
