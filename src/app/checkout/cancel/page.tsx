"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/common/header";
import { ClockIcon, CreditCardIcon, ShoppingBasketIcon } from "lucide-react";

const CheckoutErrorPage = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/ilustrator_not_paid.png"
            alt="Pagamento cancelado"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">
            Pagamento pendente
          </DialogTitle>
          <DialogDescription className="font-medium">
            <span className="inline-flex items-center justify-center gap-2">
              <ClockIcon className="h-5 w-5" />
              Seu pagamento ainda não foi concluído.
            </span>
            <p className="mt-2 text-center font-bold">
              Você pode voltar ao checkout ou continuar comprando.
            </p>
          </DialogDescription>

          <DialogFooter>
            <div className="flex w-full flex-col items-center gap-3">
              <Button
                className="w-full max-w-xs gap-2 rounded-full"
                size="lg"
                asChild
              >
                <Link href="/cart/confirmation">
                  <CreditCardIcon className="h-5 w-5" />
                  Voltar ao checkout
                </Link>
              </Button>
              <Button
                className="w-full max-w-xs gap-2 rounded-full"
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/">
                  <ShoppingBasketIcon className="h-5 w-5" />
                  Continuar comprando
                </Link>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutErrorPage;
