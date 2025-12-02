import type { BlockVariantSchema, BlockType } from "@/lib/block-variants";

export type BlockContent = Record<string, unknown>;

export interface AvailableBlock {
  id: string;
  name: string;
  type: string;
  variant?: string;
  isGlobal: boolean;
  content: BlockContent | null;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedBlock {
  instanceId: string;
  blockId: string;
  name: string;
  type: BlockType | string;
  variant: string;
  schema: BlockVariantSchema | null;
  values: BlockContent;
}
