import { cookies } from "next/headers";

export const CART_SESSION_COOKIE = "cart_session_id";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export async function getCartSessionId() {
	const cookieStore = await cookies();
	return cookieStore.get(CART_SESSION_COOKIE)?.value ?? null;
}

export async function getOrCreateCartSessionId() {
	const cookieStore = await cookies();

	let sessionId = cookieStore.get(CART_SESSION_COOKIE)?.value;

	if (!sessionId) {
		sessionId = crypto.randomUUID();

		cookieStore.set({
			name: CART_SESSION_COOKIE,
			value: sessionId,
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: THIRTY_DAYS_IN_SECONDS,
		});
	}

	return sessionId;
}
