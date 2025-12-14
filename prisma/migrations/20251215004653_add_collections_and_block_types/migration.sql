-- AlterEnum
ALTER TYPE "block_type" ADD VALUE 'HIGHLIGHTS';
ALTER TYPE "block_type" ADD VALUE 'ABOUT';
ALTER TYPE "block_type" ADD VALUE 'PROJECT_DETAILS';
ALTER TYPE "block_type" ADD VALUE 'MEDIA_DETAILS';
ALTER TYPE "block_type" ADD VALUE 'MEDIA_CARDS';

-- AlterTable
ALTER TABLE "block" ADD COLUMN "variant" TEXT NOT NULL DEFAULT 'default';

-- AlterTable
ALTER TABLE "footer_link" ADD COLUMN "nameAr" TEXT;
ALTER TABLE "footer_link" ADD COLUMN "parentId" TEXT;

-- AlterTable
ALTER TABLE "header_link" ADD COLUMN "nameAr" TEXT;
ALTER TABLE "header_link" ADD COLUMN "parentId" TEXT;

-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "hasProfilePages" BOOLEAN NOT NULL DEFAULT false,
    "profilePageSlugPattern" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_item" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "pageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionEn" JSONB,
    "descriptionAr" JSONB,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_slug_key" ON "collection"("slug");

-- CreateIndex
CREATE INDEX "collection_item_collectionId_idx" ON "collection_item"("collectionId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_item_pageId_key" ON "collection_item"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "media_slug_key" ON "media"("slug");

-- CreateIndex
CREATE INDEX "block_type_variant_idx" ON "block"("type", "variant");

-- AddForeignKey
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_item" ADD CONSTRAINT "collection_item_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "footer_link" ADD CONSTRAINT "footer_link_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "footer_link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "header_link" ADD CONSTRAINT "header_link_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "header_link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
