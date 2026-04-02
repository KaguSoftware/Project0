import { NextResponse } from "next/server";
import { addItemToCart } from "@/src/lib/cartServer";
import { getOrCreateCartSessionId } from "@/src/lib/cartSession";
import type { AddCartItemPayload } from "@/src/types/cart";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as AddCartItemPayload;

		if (!body?.productDocumentId || !body?.size) {
			return NextResponse.json(
				{ error: "productDocumentId and size are required." },
				{ status: 400 },
			);
		}

		const sessionId = await getOrCreateCartSessionId();
		const cart = await addItemToCart(sessionId, body);

		return NextResponse.json(cart, { status: 201 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to add item.";

		const status =
			message.includes("Missing") ||
			message.includes("Invalid") ||
			message.includes("available") ||
			message.includes("not found")
				? 400
				: 500;

		return NextResponse.json({ error: message }, { status });
	}
}
