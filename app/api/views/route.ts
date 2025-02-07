import { writeClient } from "@/sanity/lib/write-client";
import { client } from "@/sanity/lib/client";
import { STARTUP_VIEWS_QUERY } from "@/sanity/lib/queries";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing startup ID" },
        { status: 400 }
      );
    }

    // Get current views
    const { views: currentViews = 0 } = await client
      .withConfig({ useCdn: false })
      .fetch(STARTUP_VIEWS_QUERY, { id })
      .catch(() => ({ views: 0 }));

    // Increment views
    await writeClient
      .patch(id)
      .set({ views: currentViews + 1 })
      .commit();

    return NextResponse.json({ views: currentViews + 1 });
  } catch (error) {
    console.error("Error updating views:", error);
    return NextResponse.json(
      { error: "Failed to update views" },
      { status: 500 }
    );
  }
}
