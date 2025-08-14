import { db } from "@/db";
import { cartItemTable, cartTable, orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (
    !process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ||
    !process.env.STRIPE_WEBHOOK_SECRET
  ) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  if (event.type === "checkout.session.completed") {
    console.log("checkout session completed");
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return NextResponse.error();
    }
    await db
      .update(orderTable)
      .set({
        status: "paid",
      })
      .where(eq(orderTable.id, orderId));
    const order = await db.query.orderTable.findFirst({
      where: eq(orderTable.id, orderId),
    });
    if (order) {
      const cart = await db.query.cartTable.findFirst({
        where: eq(cartTable.userId, order.userId),
      });
      if (cart) {
        await db.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
        await db.delete(cartTable).where(eq(cartTable.id, cart.id));
      }
    }
  }
  return NextResponse.json({ received: true });
};
