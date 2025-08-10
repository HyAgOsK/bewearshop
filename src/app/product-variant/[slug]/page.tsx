import { Header } from "@/components/common/header";
import { db } from "@/db";
import { productTable, productVariantTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatCentsToBRL } from "@/helpers/money";
import { Button } from "@/components/ui/button";
import ProductList from "@/components/common/product-list";
import Footer from "@/components/common/footer";
import VariantSelector from "./components/variant-selector";
import QuantitySelector from "./components/quantoty-selector";
interface ProductVariantPageProps {
  params: Promise<{ slug: string }>;
}

const ProductVariantPage = async ({ params }: ProductVariantPageProps) => {
  const { slug } = await params;
  const productVariant = await db.query.productVariantTable.findFirst({
    where: eq(productVariantTable.slug, slug),
    with: {
      product: {
        with: { variants: true },
      },
    },
  });

  if (!productVariant) {
    return notFound();
  }

  const likelyProducts = await db.query.productTable.findMany({
    where: eq(productTable.categoryId, productVariant.product.categoryId),
    with: {
      variants: true,
    },
  });

  let imageUrl = productVariant.imageUrl;

  if (typeof imageUrl === "string") {
    imageUrl = imageUrl.replace(/^{|}$/g, "").trim(); // remove { e }
    imageUrl = imageUrl.replace(/^"+|"+$/g, ""); // remove aspas extras
  }
  const variants = await db.query.productVariantTable.findMany({
    where: eq(productVariantTable.productId, productVariant.productId),
  });

  const cleanedVariants = variants.map((v) => ({
    ...v,
    imageUrl:
      typeof v.imageUrl === "string"
        ? v.imageUrl
            .replace(/^{|}$/g, "")
            .replace(/^"+|"+$/g, "")
            .trim()
        : v.imageUrl,
  }));

  return (
    <>
      <Header />
      <div className="flex flex-col space-y-6">
        <div className="roudend-3xl relative h-[380px] w-full">
          <Image
            src={imageUrl}
            alt={productVariant.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="px-5">
          <VariantSelector
            variants={cleanedVariants}
            selectedVariantSlug={productVariant.slug}
          />
        </div>
        <div className="px-5">
          <h2 className="text-lg font-semibold">
            {productVariant.product.name}
          </h2>
          <h3 className="text-muted-foreground text-sm">
            {productVariant.name}
          </h3>
          <h3 className="text-lg font-semibold">
            {formatCentsToBRL(productVariant.priceInCents)}
          </h3>
        </div>
        <div className="px-5">
          <QuantitySelector />
        </div>
        <div className="flex flex-col space-y-4 px-5">
          <Button className="rounded-full" size="lg" variant="outline">
            Adicionar ao carrinho
          </Button>
          <Button className="size rounded-full" size="lg">
            Adicionar à sacola
          </Button>
        </div>
        <div className="px-5">
          <p className="text-shadow-amber-600">
            {productVariant.product.description}
          </p>
        </div>
        <div className="px-5">
          <ProductList
            title="Talve você queira também"
            products={likelyProducts}
          />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductVariantPage;
