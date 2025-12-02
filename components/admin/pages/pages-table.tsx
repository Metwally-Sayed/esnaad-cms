import Link from "next/link";
import { notFound } from "next/navigation";

import { getPages } from "@/server/actions/page";
import { Footer, Header, Page, PageBlock } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";

type PageWithRelations = Page & {
  header: Header | null;
  footer: Footer | null;
  blocks: PageBlock[];
};

const PagesTable = async () => {
  const pagesResult = await getPages();

  if (!pagesResult) {
    notFound();
  }

  const pages = pagesResult as PageWithRelations[];

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No pages found</p>
      </div>
    );
  }

  const getSlugPath = (slug: string) =>
    slug.startsWith("/") ? slug : `/${slug}`;

  return (
    <div className="w-full">
      <div className="flex justify-end items-end w-full mb-2">
        <Link href="/admin/pages/create">
          <Button>
            <PlusIcon className="w-4 h-4 ml-2" />
            Create New Page
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Page</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Header</TableHead>
            <TableHead>Footer</TableHead>
            <TableHead>Blocks</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pages.map((page) => {
            const slugPath = getSlugPath(page.slug);
            const blocksCount = page.blocks?.length || 0;

            return (
              <TableRow key={page.id} className="hover:bg-muted/50 transition">
                <TableCell>
                  <Link
                    href={slugPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-0.5 rounded-md border border-transparent px-1 py-0.5 transition-colors hover:border-border"
                  >
                    <span className="font-medium">{page.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {page.description || "No description"}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={slugPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary underline-offset-2 hover:underline"
                  >
                    {slugPath}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {page.header?.name || "Global Default"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {page.footer?.name || "Global Default"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {blocksCount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/pages/${page.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PagesTable;
