import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getAvailableBlocks } from "@/server/actions/block";
import { getPageWithBlocks } from "@/server/actions/page";
import PageCreateForm from "@/components/admin/pages/page-create-form";

type EditPageProps = {
  params: Promise<{
    pageId: string;
  }>;
};

const EditPage = async ({ params }: EditPageProps) => {
  const { pageId } = await params;
  const t = await getTranslations("PageEditor");

  const [blocksResult, page] = await Promise.all([
    getAvailableBlocks(),
    getPageWithBlocks(pageId),
  ]);

  if (!blocksResult.success) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        {blocksResult.error || "Unable to load blocks for this workspace."}
      </div>
    );
  }

  if (!page) {
    notFound();
  }

  const initialPage = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    description: page.description,
    published: page.published,
    blocks: page.blocks.map((block) => ({
      id: block.id,
      order: block.order,
      blockId: block.blockId,
      block: {
        id: block.block.id,
        name: block.block.name,
        type: block.block.type,
        variant: block.block.variant,
        content: block.block.content as Record<string, unknown> | null,
      },
    })),
    // SEO Metadata (English)
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
    seoKeywords: page.seoKeywords,
    focusKeyword: page.focusKeyword,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    ogImage: page.ogImage,
    ogType: page.ogType,
    ogUrl: page.ogUrl,
    ogSiteName: page.ogSiteName,
    ogLocale: page.ogLocale,
    ogLocaleAlternate: page.ogLocaleAlternate,
    ogArticleAuthor: page.ogArticleAuthor,
    ogArticlePublishedTime: page.ogArticlePublishedTime,
    ogArticleModifiedTime: page.ogArticleModifiedTime,
    ogArticleSection: page.ogArticleSection,
    ogArticleTags: page.ogArticleTags,
    twitterCard: page.twitterCard,
    twitterTitle: page.twitterTitle,
    twitterDescription: page.twitterDescription,
    twitterImage: page.twitterImage,
    twitterImageAlt: page.twitterImageAlt,
    twitterSite: page.twitterSite,
    twitterCreator: page.twitterCreator,
    canonicalUrl: page.canonicalUrl,
    robots: page.robots,
    metaRobots: page.metaRobots,
    alternateLanguages: page.alternateLanguages,
    author: page.author,
    publishedDate: page.publishedDate,
    modifiedDate: page.modifiedDate,
    category: page.category,
    tags: page.tags,
    structuredData: page.structuredData,
    breadcrumbTitle: page.breadcrumbTitle,
    noindex: page.noindex,
    nofollow: page.nofollow,
    // SEO Metadata (Arabic)
    titleAr: page.titleAr,
    seoTitleAr: page.seoTitleAr,
    seoDescriptionAr: page.seoDescriptionAr,
    seoKeywordsAr: page.seoKeywordsAr,
    focusKeywordAr: page.focusKeywordAr,
    ogTitleAr: page.ogTitleAr,
    ogDescriptionAr: page.ogDescriptionAr,
    ogImageAr: page.ogImageAr,
    twitterTitleAr: page.twitterTitleAr,
    twitterDescriptionAr: page.twitterDescriptionAr,
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {t("pages")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{t("editPage")}</h1>
        <p className="text-muted-foreground">
          {t("editDescription")}
        </p>
      </div>

      <PageCreateForm blocks={blocksResult.data} initialPage={initialPage} />
    </div>
  );
};

export default EditPage;
