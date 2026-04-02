import { NextResponse } from "next/server";
import {
	removeItemFromCart,
	updateCartItemQuantity,
} from "@/src/lib/cartServer";
import { getOrCreateCartSessionId } from "@/src/lib/cartSession";

export const dynamic = "force-dynamic";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ itemId: string }> },
) {
	try {
		const { itemId } = await params;
		const body = (await request.json()) as { quantity?: number };

		if (!Number.isInteger(body.quantity) || Number(body.quantity) < 1) {
			return NextResponse.json(
				{ error: "Quantity must be at least 1." },
				{ status: 400 },
			);
		}

		const sessionId = await getOrCreateCartSessionId();
		const cart = await updateCartItemQuantity(
			sessionId,
			itemId,
			Number(body.quantity),
		);

		return NextResponse.json(cart);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to update cart item.";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: Promise<{ itemId: string }> },
) {
	try {
		const { itemId } = await params;
		const sessionId = await getOrCreateCartSessionId();
		const cart = await removeItemFromCart(sessionId, itemId);

		return NextResponse.json(cart);
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: "Failed to remove cart item.";

		return NextResponse.json({ error: message }, { status: 500 });
	}
}
