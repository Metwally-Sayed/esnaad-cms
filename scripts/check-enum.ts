
import { BlockType } from "@prisma/client";

console.log("BlockType keys:", Object.keys(BlockType));
console.log("Has PROJECT_DETAILS?", "PROJECT_DETAILS" in BlockType);
