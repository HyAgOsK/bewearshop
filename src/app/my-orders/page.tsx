import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Header } from "@/components/common/header";
import { db } from "@/db";
import { orderTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import Orders from "./components/orders";
import EmptyState from "@/components/common/empty-state";
import { ShoppingBasketIcon } from "lucide-react";

const MyOrdersPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    redirect("/");
  }
  const orders = await db.query.orderTable.findMany({
    where: eq(orderTable.userId, session?.user.id),
    with: {
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            },
          },
        },
      },
    },
  });

  return (
    <>
      <Header />
      <div className="px-5">
        {orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBasketIcon className="size-16 sm:size-20" />}
            title="Você ainda não possui pedidos"
            subtitle={
              <>
                <span>
                  Que tal explorar a loja e fazer sua primeira compra?
                </span>
                <span role="img" aria-label="sparkles">
                  ✨
                </span>
              </>
            }
            primaryAction={{ href: "/", label: "Voltar para a loja" }}
          />
        ) : (
          <Orders
            orders={orders.map((order) => ({
              id: order.id,
              totalPriceInCents: order.totalPriceInCents,
              status: order.status,
              createdAt: order.createdAt,
              items: order.items.map((item) => ({
                id: item.id,
                imageUrl: item.productVariant.imageUrl,
                productName: item.productVariant.product.name,
                productVariantName: item.productVariant.name,
                priceInCents: item.productVariant.priceInCents,
                quantity: item.quantity,
              })),
            }))}
          />
        )}
      </div>
    </>
  );
};

export default MyOrdersPage;
