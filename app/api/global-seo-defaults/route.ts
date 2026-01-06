import { NextResponse } from "next/server";
import { getGlobalSeoDefaults } from "@/server/actions/global-settings";

export async function GET() {
  const result = await getGlobalSeoDefaults();
  return NextResponse.json(result);
}
