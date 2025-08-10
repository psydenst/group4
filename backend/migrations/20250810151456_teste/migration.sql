-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(512),
    "img_link" VARCHAR(512) NOT NULL,
    "latitude" DECIMAL(11,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProductConfig" (
    "id" SERIAL NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "climaInfluence" INTEGER NOT NULL,
    "category" VARCHAR(120) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductConfig_productId_key" ON "public"."ProductConfig"("productId");

-- AddForeignKey
ALTER TABLE "public"."ProductConfig" ADD CONSTRAINT "ProductConfig_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
