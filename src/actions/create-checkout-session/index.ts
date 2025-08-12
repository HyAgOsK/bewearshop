"use server";

import { auth } from "@/lib/auth";
import { createCheckoutSessionSchema } from "./schema";
import { headers } from "next/headers";
import { db } from "@/db";
import { orderItemTable, orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

export const createCheckoutSession = async (
  data: createCheckoutSessionSchema,
) => {
  if (!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not set");
  }
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session?.user) {
    throw new Error("Unauthorizated");
  }
  const { orderId } = createCheckoutSessionSchema.parse(data);
  let appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl || !/^https?:\/\//.test(appUrl)) {
    const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";
    const host =
      requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    if (host) {
      appUrl = `${protocol}://${host}`;
    }
  }
  const order = await db.query.orderTable.findFirst({
    where: eq(orderTable.id, orderId),
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const orderItems = await db.query.orderItemTable.findMany({
    where: eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: {
        with: {
          product: true,
        },
      },
    },
  });
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${appUrl}/checkout/success`,
    cancel_url: `${appUrl}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map((orderItem) => {
      return {
        price_data: {
          currency: "brl",
          product_data: {
            name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
            description: orderItem.productVariant.product.description,
            images: [
              orderItem.productVariant.imageUrl
                .replace(/^{|}$/g, "")
                .replace(/^"+|"+$/g, "")
                .trim(),
            ],
          },
          unit_amount: orderItem.productVariant.priceInCents,
        },
        quantity: orderItem.quantity,
      };
    }),
  });
  return checkoutSession;
};
