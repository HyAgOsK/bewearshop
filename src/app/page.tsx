import Image from "next/image";

import { Header } from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });

  console.log("Products found:", products.length);
  console.log("First product:", products[0]);

  return (
    <>
      <Header />
      <div className="pg-5 space-y-6">
        <div className="px-5">
          <Image
            src="/banner01.png"
            alt="leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>

        <ProductList products={products} title="Mais Vendidos" />
        <div className="px-5">
          <Image
            src="/banner02.png"
            alt="leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
