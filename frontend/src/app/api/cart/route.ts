import { NextResponse } from "next/server";
import { clearCart, getCartResponse } from "@/src/lib/cartServer";
import { getOrCreateCartSessionId } from "@/src/lib/cartSession";

export const dynamic = "force-dynamic";

export async function GET() {
	try {
		const sessionId = await getOrCreateCartSessionId();
		const cart = await getCartResponse(sessionId);

		return NextResponse.json(cart);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to load cart.";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE() {
	try {
		const sessionId = await getOrCreateCartSessionId();
		const cart = await clearCart(sessionId);

		return NextResponse.json(cart);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to clear cart.";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
