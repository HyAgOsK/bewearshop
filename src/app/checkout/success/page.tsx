"use client";

import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

const CheckoutSuccessPage = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="mt-4 text-2xl">Pedido efetuado!</DialogTitle>
          <DialogDescription className="font-medium">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status
            na seção de “Meus Pedidos”.
          </DialogDescription>

          <DialogFooter className="flex justify-center">
            <div className="mx-auto flex w-full max-w-md flex-row items-center justify-center gap-3">
              <Button className="flex-1 rounded-full" size="lg" asChild>
                <Link href="/my-orders" className="w-full text-center">
                  Ver meus pedidos
                </Link>
              </Button>
              <Button
                className="flex-1 rounded-full"
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/" className="w-full text-center">
                  Voltar para a loja
                </Link>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckoutSuccessPage;
