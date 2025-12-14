import { getAllMediaItems } from "../server/actions/media";

async function debugFilter() {
  console.log("=== DEBUG: Media Items Fetch ===\n");

  const result = await getAllMediaItems("updatedAt");

  if (result.success && result.data) {
    console.log("✅ getAllMediaItems returned:", result.data.length, "items");
    result.data.forEach((item) => {
      console.log("  -", item.nameEn, "(type:", item.type + ")");
    });
  } else {
    console.log("❌ getAllMediaItems failed:", result.error);
  }

  console.log("\n=== Simulating Filter Logic ===\n");

  const content = {
    collectionId: "cmiz3jaum000018t94oabjq7m",
    filterType: "",
    sortBy: "updatedAt" as const,
    limit: 0,
    showFilters: true,
  };

  const urlFilterType = undefined;
  const activeFilter = urlFilterType || content.filterType;

  console.log("content.filterType:", JSON.stringify(content.filterType));
  console.log("urlFilterType:", urlFilterType);
  console.log("activeFilter:", JSON.stringify(activeFilter));
  console.log("typeof activeFilter:", typeof activeFilter);
  console.log("activeFilter is empty string:", activeFilter === "");
  console.log("activeFilter.trim():", activeFilter.trim());
  console.log("activeFilter.trim() !== '':", activeFilter.trim() !== "");

  // The actual condition from MediaCardsWithFilters
  const part1 = activeFilter;
  const part2 = typeof activeFilter === "string";
  const part3 = activeFilter.trim() !== "";
  const shouldFilter = part1 && part2 && part3;

  console.log("\nCondition breakdown:");
  console.log("  activeFilter:", part1);
  console.log("  typeof activeFilter === 'string':", part2);
  console.log("  activeFilter.trim() !== '':", part3);
  console.log("  Final result (AND):", shouldFilter);

  if (shouldFilter) {
    console.log("\n❌ BUG: Filter WILL be applied (items will be filtered)");
  } else {
    console.log("\n✅ CORRECT: No filter will be applied (all items shown)");
  }
}

debugFilter()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    process.exit();
  });
