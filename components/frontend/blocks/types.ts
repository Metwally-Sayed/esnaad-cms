import type { Block, PageBlock } from "@prisma/client";

// Shared type for page blocks that include the resolved block data.
export type PageBlockWithBlock = PageBlock & {
  block: Block;
};
