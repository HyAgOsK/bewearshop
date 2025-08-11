import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Header } from "@/components/common/header";
import Adresses from "./components/addresses";
import CartSummary from "../components/cart-summary";
import { Separator } from "@radix-ui/react-separator";
import Footer from "@/components/common/footer";

const IndetificationPage = async () => {
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

  const cartTotalInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0,
  );

  return (
    <div>
      <Header />
      <div className="px-5">
        <Adresses
          shippdingaddresses={shippdingaddresses}
          defaultShippingAdressId={cart.shippingAddress?.id || null}
        />
        <div className="py-3">
          <Separator />
        </div>
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map((item) => ({
            id: item.productVariant.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            princeInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />
      </div>
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
};

export default IndetificationPage;
