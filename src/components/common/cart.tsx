"use client";

import { ShipIcon, ShoppingBagIcon, ShoppingBasketIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCentsToBRL } from "@/helpers/money";
import Image from "next/image";

import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import CartItem from "./cart-item";
import EmptyState from "./empty-state";
import { useCart } from "@/hooks/queries/use-cart";
import Link from "next/link";

export const Cart = ({ trigger }: { trigger?: React.ReactNode }) => {
  const { data: cart } = useCart();
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="icon">
            <ShoppingBasketIcon />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="overflow-hidden">
        <SheetHeader>
          <SheetTitle>Carrinho</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full px-1">
              {cart?.items && cart.items.length > 0 ? (
                <div className="flex flex-col gap-8 py-5 pb-40">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      productName={item.productVariant.product.name}
                      productVariantId={item.productVariant.id}
                      productVariantName={item.productVariant.name}
                      productVariantImageUrl={item.productVariant.imageUrl}
                      productVariantPriceInCents={
                        item.productVariant.priceInCents
                      }
                      quantity={item.quantity}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<ShoppingBasketIcon className="size-16 sm:size-20" />}
                  title="Seu carrinho está vazio!"
                  subtitle={
                    <>
                      <span>Que tal encontrar algo incrível para você?</span>
                      <span role="img" aria-label="sparkles">
                        ✨
                      </span>
                    </>
                  }
                  primaryAction={{ href: "/", label: "Voltar para a loja" }}
                  secondaryAction={{
                    href: "/my-orders",
                    label: "Ver meus pedidos",
                    variant: "outline",
                  }}
                />
              )}
            </ScrollArea>
          </div>

          {cart?.items && cart?.items.length > 0 && (
            <div className="flex flex-col gap-4 px-5 pb-5">
              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Subtotal</p>
                <p>{formatCentsToBRL(cart?.totalPrinceInCents ?? 0)}</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Entrega</p>
                <p>GRÁTIS</p>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-xs font-medium">
                <p>Total</p>
                <p>{formatCentsToBRL(cart?.totalPrinceInCents ?? 0)}</p>
              </div>

              <Button className="mt-5 rounded-full" asChild>
                <Link href="/cart/identification">Finalizar compra</Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// SERVER ACTION
