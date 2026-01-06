import { getGlobalSeoDefaults } from "../server/actions/global-settings";

async function main() {
  console.log("Testing getGlobalSeoDefaults...");
  const result = await getGlobalSeoDefaults();
  console.log("Result:", JSON.stringify(result, null, 2));
}

main().catch(console.error);
