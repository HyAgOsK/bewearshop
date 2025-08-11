import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Header } from "@/components/common/header";
import Adresses from "./components/addresses";

export const IndetificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/");
  }
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
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

  if (!cart || cart?.items.length === 0) {
    redirect("/");
  }

  const shippdingaddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session?.user.id),
  });

  return (
    <>
      <Header />
      <div className="px-5">
        <Adresses
          shippdingaddresses={shippdingaddresses}
          defaultShippingAdressId={cart.shippingAddress?.id || null}
        />
      </div>
    </>
  );
};

export default IndetificationPage;
