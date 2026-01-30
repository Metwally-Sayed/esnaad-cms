"use server";

import prisma from "@/lib/prisma";
import { pageDetailsSchema } from "@/lib/validators/page";
import { BlockType, Prisma } from "@prisma/client";
import { updateTag } from "next/cache";
import { z } from "zod/v3";

export async function getPageBySlug({ slug }: { slug: string }) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        slug,
      },
      include: {
        blocks: {
          orderBy: {
            order: "asc",
          },
          include: {
            block: true,
          },
        },
        header: true,
        footer: true,
        collectionItem: {
          include: {
            collection: true,
          },
        },
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return null;
  }
}

const pageBlockSchema = z.object({
  blockId: z.string().min(1),
  order: z.number().int().min(0),
  name: z.string().min(1),
  type: z.nativeEnum(BlockType),
  variant: z.string().default("default"),
  content: z.record(z.any()).optional(),
});

const createPageSchema = pageDetailsSchema.extend({
  blocks: z.array(pageBlockSchema),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;

export async function createPage(input: CreatePageInput) {
  const parsed = createPageSchema.safeParse(input);

  if (!parsed.success) {
    const message =
      parsed.error.errors[0]?.message || "Invalid page configuration.";
    return {
      success: false,
      error: message,
    };
  }

  const { blocks, ...pageData } = parsed.data;

  const normalizedSlug = pageData.slug.startsWith("/")
    ? pageData.slug.toLowerCase()
    : `/${pageData.slug}`.toLowerCase();

  try {
    const { metadata, ...corePageData } = pageData;

    const createdPage = await prisma.page.create({
      data: {
        title: corePageData.title,
        slug: normalizedSlug.replace(/\/{2,}/g, "/"),
        description:
          corePageData.description && corePageData.description.length > 0
            ? corePageData.description
            : null,
        published: corePageData.published,
        // Basic SEO Metadata
        seoTitle: metadata?.seoTitle || null,
        seoDescription: metadata?.seoDescription || null,
        seoKeywords: metadata?.seoKeywords || [],
        focusKeyword: metadata?.focusKeyword || null,
        // Open Graph
        ogTitle: metadata?.ogTitle || null,
        ogDescription: metadata?.ogDescription || null,
        ogImage: metadata?.ogImage || null,
        ogType: metadata?.ogType || "website",
        ogUrl: metadata?.ogUrl || null,
        ogSiteName: metadata?.ogSiteName || null,
        ogLocale: metadata?.ogLocale || "en_US",
        ogLocaleAlternate: metadata?.ogLocaleAlternate || [],
        // Open Graph Article
        ogArticleAuthor: metadata?.ogArticleAuthor || null,
        ogArticlePublishedTime: metadata?.ogArticlePublishedTime || null,
        ogArticleModifiedTime: metadata?.ogArticleModifiedTime || null,
        ogArticleSection: metadata?.ogArticleSection || null,
        ogArticleTags: metadata?.ogArticleTags || [],
        // Twitter Card
        twitterCard: metadata?.twitterCard || "summary_large_image",
        twitterTitle: metadata?.twitterTitle || null,
        twitterDescription: metadata?.twitterDescription || null,
        twitterImage: metadata?.twitterImage || null,
        twitterImageAlt: metadata?.twitterImageAlt || null,
        twitterSite: metadata?.twitterSite || null,
        twitterCreator: metadata?.twitterCreator || null,
        // Technical SEO
        canonicalUrl: metadata?.canonicalUrl || null,
        robots: metadata?.robots || "index,follow",
        metaRobots: metadata?.metaRobots || null,
        alternateLanguages: metadata?.alternateLanguages || [],
        // Content Metadata
        author: metadata?.author || null,
        publishedDate: metadata?.publishedDate || null,
        modifiedDate: metadata?.modifiedDate || null,
        category: metadata?.category || null,
        tags: metadata?.tags || [],
        // Structured Data
        structuredData: metadata?.structuredData || null,
        // Advanced
        breadcrumbTitle: metadata?.breadcrumbTitle || null,
        noindex: metadata?.noindex || false,
        nofollow: metadata?.nofollow || false,
        // Arabic SEO fields
        titleAr: metadata?.titleAr || null,
        seoTitleAr: metadata?.seoTitleAr || null,
        seoDescriptionAr: metadata?.seoDescriptionAr || null,
        seoKeywordsAr: metadata?.seoKeywordsAr || [],
        focusKeywordAr: metadata?.focusKeywordAr || null,
        ogTitleAr: metadata?.ogTitleAr || null,
        ogDescriptionAr: metadata?.ogDescriptionAr || null,
        ogImageAr: metadata?.ogImageAr || null,
        twitterTitleAr: metadata?.twitterTitleAr || null,
        twitterDescriptionAr: metadata?.twitterDescriptionAr || null,
      },
    });

    const createdBlocks = await Promise.all(
      blocks.map(async (block) => {
        const newBlock = await prisma.block.create({
          data: {
            name: block.name,
            type: block.type,
            variant: block.variant || "default",
            content: block.content ?? {},
            isGlobal: false,
          },
        });

        return {
          pageId: createdPage.id,
          blockId: newBlock.id,
          order: block.order,
        };
      })
    );

    await prisma.pageBlock.createMany({
      data: createdBlocks,
    });

    // Invalidate cache for all pages and this specific page
    updateTag("pages");
    updateTag(`page-${normalizedSlug.replace(/\/{2,}/g, "/")}`);

    return {
      success: true,
      data: createdPage,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A page with this slug already exists.",
      };
    }

    console.error("Error creating page:", error);
    return {
      success: false,
      error: "Failed to create page.",
    };
  }
}
export async function getPages() {
  try {
    const pages = await prisma.page.findMany({
      include: {
        blocks: true,
        header: true,
        footer: true,
      },
    });

    return pages;
  } catch (error) {
    console.error("Error fetching pages:", error);
    return null;
  }
}

export async function getPageWithBlocks(pageId: string) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        id: pageId,
      },
      include: {
        header: true,
        footer: true,
        blocks: {
          orderBy: {
            order: "asc",
          },
          include: {
            block: {
              select: {
                id: true,
                name: true,
                type: true,
                variant: true,
                content: true,
              },
            },
          },
        },
      },
    });

    return page;
  } catch (error) {
    console.error("Error fetching page with blocks:", error);
    return null;
  }
}

export async function updatePage(pageId: string, input: CreatePageInput) {
  const parsed = createPageSchema.safeParse(input);

  if (!parsed.success) {
    const message =
      parsed.error.errors[0]?.message || "Invalid page configuration.";
    return {
      success: false,
      error: message,
    };
  }

  const { blocks, ...pageData } = parsed.data;

  const normalizedSlug = pageData.slug.startsWith("/")
    ? pageData.slug.toLowerCase()
    : `/${pageData.slug}`.toLowerCase();

  try {
    const { metadata, ...corePageData } = pageData;

    const updatedPage = await prisma.$transaction(async (tx) => {
      const targetPage = await tx.page.update({
        where: { id: pageId },
        data: {
          title: corePageData.title,
          slug: normalizedSlug.replace(/\/{2,}/g, "/"),
          description:
            corePageData.description && corePageData.description.length > 0
              ? corePageData.description
              : null,
          published: corePageData.published,
          // Basic SEO Metadata
          seoTitle: metadata?.seoTitle || null,
          seoDescription: metadata?.seoDescription || null,
          seoKeywords: metadata?.seoKeywords || [],
          focusKeyword: metadata?.focusKeyword || null,
          // Open Graph
          ogTitle: metadata?.ogTitle || null,
          ogDescription: metadata?.ogDescription || null,
          ogImage: metadata?.ogImage || null,
          ogType: metadata?.ogType || "website",
          ogUrl: metadata?.ogUrl || null,
          ogSiteName: metadata?.ogSiteName || null,
          ogLocale: metadata?.ogLocale || "en_US",
          ogLocaleAlternate: metadata?.ogLocaleAlternate || [],
          // Open Graph Article
          ogArticleAuthor: metadata?.ogArticleAuthor || null,
          ogArticlePublishedTime: metadata?.ogArticlePublishedTime || null,
          ogArticleModifiedTime: metadata?.ogArticleModifiedTime || null,
          ogArticleSection: metadata?.ogArticleSection || null,
          ogArticleTags: metadata?.ogArticleTags || [],
          // Twitter Card
          twitterCard: metadata?.twitterCard || "summary_large_image",
          twitterTitle: metadata?.twitterTitle || null,
          twitterDescription: metadata?.twitterDescription || null,
          twitterImage: metadata?.twitterImage || null,
          twitterImageAlt: metadata?.twitterImageAlt || null,
          twitterSite: metadata?.twitterSite || null,
          twitterCreator: metadata?.twitterCreator || null,
          // Technical SEO
          canonicalUrl: metadata?.canonicalUrl || null,
          robots: metadata?.robots || "index,follow",
          metaRobots: metadata?.metaRobots || null,
          alternateLanguages: metadata?.alternateLanguages || [],
          // Content Metadata
          author: metadata?.author || null,
          publishedDate: metadata?.publishedDate || null,
          modifiedDate: metadata?.modifiedDate || null,
          category: metadata?.category || null,
          tags: metadata?.tags || [],
          // Structured Data
          structuredData: metadata?.structuredData || null,
          // Advanced
          breadcrumbTitle: metadata?.breadcrumbTitle || null,
          noindex: metadata?.noindex || false,
          nofollow: metadata?.nofollow || false,
          // Arabic SEO fields
          titleAr: metadata?.titleAr || null,
          seoTitleAr: metadata?.seoTitleAr || null,
          seoDescriptionAr: metadata?.seoDescriptionAr || null,
          seoKeywordsAr: metadata?.seoKeywordsAr || [],
          focusKeywordAr: metadata?.focusKeywordAr || null,
          ogTitleAr: metadata?.ogTitleAr || null,
          ogDescriptionAr: metadata?.ogDescriptionAr || null,
          ogImageAr: metadata?.ogImageAr || null,
          twitterTitleAr: metadata?.twitterTitleAr || null,
          twitterDescriptionAr: metadata?.twitterDescriptionAr || null,
        },
      });

      const existingBlocks = await tx.pageBlock.findMany({
        where: { pageId },
        select: { blockId: true },
      });

      if (existingBlocks.length) {
        await tx.pageBlock.deleteMany({ where: { pageId } });
        await tx.block.deleteMany({
          where: { id: { in: existingBlocks.map((b) => b.blockId) } },
        });
      }

      const createdBlocks = await Promise.all(
        blocks.map(async (block) => {
          const newBlock = await tx.block.create({
            data: {
              name: block.name,
              type: block.type,
              variant: block.variant || "default",
              content: block.content ?? {},
              isGlobal: false,
            },
          });

          return {
            pageId: targetPage.id,
            blockId: newBlock.id,
            order: block.order,
          };
        })
      );

      if (createdBlocks.length) {
        await tx.pageBlock.createMany({
          data: createdBlocks,
        });
      }

      return targetPage;
    });

    // Invalidate cache for all pages and this specific page
    updateTag("pages");
    updateTag(`page-${normalizedSlug.replace(/\/{2,}/g, "/")}`);

    return {
      success: true,
      data: updatedPage,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "A page with this slug already exists.",
      };
    }

    console.error("Error updating page:", error);
    return {
      success: false,
      error: "Failed to update page.",
    };
  }
}
