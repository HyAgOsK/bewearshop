"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { getShippingAddressesSchema } from "./schema";

export const getUserAddresses = async () => {
  getShippingAddressesSchema.parse({});

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const addresses = await db.query.shippingAddressTable.findMany({
    where: (t, { eq }) => eq(t.userId, session.user.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return addresses;
};
