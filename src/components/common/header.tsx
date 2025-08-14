"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  MenuIcon,
  LogInIcon,
  LogOutIcon,
  HomeIcon,
  PackageIcon,
  ShoppingBasketIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";
import { authClient } from "@/lib/auth-clients";
import { Cart } from "./cart";
import { Separator } from "../ui/separator";
import CategorySelector from "./category-selector";
import { useCategories } from "@/hooks/queries/use-categories";

export const Header = () => {
  const { data: session } = authClient.useSession();
  const { data: categories } = useCategories();

  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/Logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex justify-between space-y-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image as string | undefined}
                        />
                        <AvatarFallback>
                          {session?.user?.name?.split(" ")?.[0]?.[0]}
                          {session?.user?.name?.split(" ")?.[1]?.[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="font-semibold">{session?.user?.name}</h3>
                        <span className="text-muted-foreground block text-xs">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => authClient.signOut()}
                    >
                      <LogOutIcon />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button size="icon" asChild variant="outline">
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}

              <div className="py-5">
                <Separator />
              </div>
              <nav className="flex flex-col gap-2">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="hover:bg-accent flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <HomeIcon className="size-4" />
                    Início
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/my-orders"
                    className="hover:bg-accent flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
                  >
                    <PackageIcon className="size-4" />
                    Meus Pedidos
                  </Link>
                </SheetClose>
                <Cart
                  trigger={
                    <button className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium">
                      <ShoppingBasketIcon className="size-4" />
                      Sacola
                    </button>
                  }
                />
              </nav>
              <div className="py-5">
                <Separator />
              </div>
              {categories?.length ? (
                <div className="pb-5">
                  <div className="flex flex-col gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant="ghost"
                        className="justify-start rounded-full bg-white text-xs font-semibold"
                        asChild
                      >
                        <Link href={`/category/${category.slug}`}>
                          {category.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
};
