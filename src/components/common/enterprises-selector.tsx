"use client";

import Image from "next/image";

const enterpriseImages = {
  adidas: "adidas.png",
  nike: "nike.png",
  puma: "puma.png",
  newbalance: "newbalance.png",
  converse: "converse-logo-1.svg",
  halfloren: "ralphlauren.svg",
  zara: "zara.svg",
  // Adicione mais nomes de arquivos conforme necessário
};

// Função para formatar os nomes das marcas
const formatBrandName = (name: string) => {
  const nameMap: { [key: string]: string } = {
    adidas: "Adidas",
    nike: "Nike",
    puma: "Puma",
    newbalance: "New Balance",
    converse: "Converse",
    halfloren: "Ralph Lauren",
    zara: "Zara",
  };

  return nameMap[name] || name.charAt(0).toUpperCase() + name.slice(1);
};

const EnterprisesSelector = () => {
  return (
    <div>
      <h3 className="px-5 text-lg font-semibold">Marcas parceiras</h3>
      <div className="flex gap-3 overflow-x-auto px-5 py-2 [&::-webkit-scrollbar]:hidden">
        {Object.entries(enterpriseImages).map(([name, img], idx) => (
          <div key={img} className="flex flex-col items-center">
            <div className="flex min-h-[120px] min-w-[120px] flex-col items-center justify-center rounded-lg bg-white p-4 shadow-sm">
              <div className="relative h-12 w-12">
                <Image
                  src={`/enterprises/${img}`}
                  alt={`Logo ${formatBrandName(name)}`}
                  fill
                  style={{ objectFit: "contain" }}
                  sizes="60px"
                  priority={idx < 3}
                />
              </div>
            </div>
            <p className="text-md mt-2 text-center font-bold text-gray-800">
              {formatBrandName(name)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnterprisesSelector;
