import { cookies } from "next/headers";
import {
	EMPTY_CART,
	type AddCartItemPayload,
	type CartItem,
	type CartResponse,
	type CartSize,
} from "@/src/types/cart";
import { getStrapiServerURL, strapiFetch } from "@/src/lib/strapiServer";

type StrapiListResponse<T> = {
	data: T[];
	meta: unknown;
};

type StrapiSingleResponse<T> = {
	data: T;
	meta: unknown;
};

type StrapiMedia =
	| { url?: string | null }
	| { data?: { url?: string | null } | Array<{ url?: string | null }> }
	| Array<{ url?: string | null }>
	| null
	| undefined;

type StrapiProduct = {
	documentId: string;
	title: string;
	slug: string;
	price: number | string;
	sizeXS: boolean;
	sizeS: boolean;
	sizeM: boolean;
	sizeL: boolean;
	sizeXL: boolean;
	sizeXXL: boolean;
	image?: StrapiMedia;
};

type StrapiCartItem = {
	documentId: string;
	quantity: number;
	size: CartSize;
	unitPrice: number | string;
	titleSnapshot: string;
	slugSnapshot: string;
	imageSnapshot?: string | null;
};

type StrapiCart = {
	documentId: string;
	sessionId: string;
	cartStatus: "active" | "ordered";
	items?: StrapiCartItem[];
	user?: any;
};

const SIZE_FIELD_MAP: Record<CartSize, keyof StrapiProduct> = {
	XS: "sizeXS",
	S: "sizeS",
	M: "sizeM",
	L: "sizeL",
	XL: "sizeXL",
	XXL: "sizeXXL",
};

function getStrapiMediaUrl(url?: string | null) {
	if (!url) return "/mock-images/mockshirt.png";
	if (url.startsWith("http")) return url;
	return getStrapiServerURL(url);
}

function extractProductImageUrl(image: StrapiMedia): string {
	if (!image) return "/mock-images/mockshirt.png";

	if (Array.isArray(image)) {
		return getStrapiMediaUrl(image[0]?.url);
	}

	if ("url" in image && image.url) {
		return getStrapiMediaUrl(image.url);
	}

	if ("data" in image && image.data) {
		return extractProductImageUrl(image.data as StrapiMedia);
	}

	return "/mock-images/mockshirt.png";
}

function normalizeCart(cart: StrapiCart | null): CartResponse {
	if (!cart) {
		return {
			cart: {
				documentId: null,
				sessionId: null,
				items: [],
			},
			itemCount: 0,
			subtotal: 0,
		};
	}

	const items: CartItem[] = (cart.items ?? []).map((item) => ({
		documentId: item.documentId,
		title: item.titleSnapshot,
		slug: item.slugSnapshot,
		imageUrl: item.imageSnapshot || "/mock-images/mockshirt.png",
		size: item.size,
		quantity: Number(item.quantity),
		unitPrice: Number(item.unitPrice),
	}));

	return {
		cart: {
			documentId: cart.documentId,
			sessionId: cart.sessionId,
			items,
		},
		itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
		subtotal: items.reduce(
			(sum, item) => sum + item.unitPrice * item.quantity,
			0,
		),
	};
}

async function getStrapiUser() {
	const cookieStore = await cookies();
	const jwt = cookieStore.get("strapi_jwt")?.value;

	if (!jwt) return null;

	try {
		const res = await fetch(getStrapiServerURL("/api/users/me"), {
			headers: { Authorization: `Bearer ${jwt}` },
			cache: "no-store",
		});

		if (!res.ok) return null;
		return await res.json();
	} catch (error) {
		return null;
	}
}

export async function findActiveCart(sessionId: string) {
	const user = await getStrapiUser();
	const params = new URLSearchParams();

	params.set("filters[cartStatus][$eq]", "active");
	params.append("populate", "items");
	params.append("populate", "user");
	params.set("pagination[pageSize]", "1");
	params.set("sort", "updatedAt:desc"); // Grab the most recently used cart

	if (user?.id) {
		// Look for a cart belonging to the logged-in user OR this specific browser session
		params.set("filters[$or][0][user][id][$eq]", user.id);
		params.set("filters[$or][1][sessionId][$eq]", sessionId);
	} else {
		params.set("filters[sessionId][$eq]", sessionId);
	}

	const response = await strapiFetch<StrapiListResponse<StrapiCart>>(
		`/api/carts?${params.toString()}`,
	);

	return response.data[0] ?? null;
}

export async function getOrCreateActiveCart(sessionId: string) {
	const user = await getStrapiUser();
	const existingCart = await findActiveCart(sessionId);

	if (existingCart) {
		// If they have a cart but it's not linked to their account yet, link it now
		const needsUserLink = user?.id && !existingCart.user;

		if (needsUserLink) {
			await strapiFetch(`/api/carts/${existingCart.documentId}`, {
				method: "PUT",
				body: JSON.stringify({
					data: { user: user.id },
				}),
			});
		}
		return existingCart;
	}

	// Create a brand new cart if one doesn't exist
	const cartData: any = {
		sessionId,
		cartStatus: "active",
	};

	if (user?.id) {
		cartData.user = user.id;
	}

	const created = await strapiFetch<StrapiSingleResponse<StrapiCart>>(
		"/api/carts",
		{
			method: "POST",
			body: JSON.stringify({ data: cartData }),
		},
	);

	return {
		...created.data,
		items: [],
	};
}

export async function getCartResponse(sessionId: string) {
	const cart = await findActiveCart(sessionId);
	return normalizeCart(cart);
}

async function getProductByDocumentId(
	productDocumentId: string,
	locale?: string,
) {
	const params = new URLSearchParams();
	params.set("populate", "image");

	if (locale) {
		params.set("locale", locale);
	}

	const response = await strapiFetch<StrapiSingleResponse<StrapiProduct>>(
		`/api/products/${productDocumentId}?${params.toString()}`,
	);

	return response.data;
}

export async function addItemToCart(
	sessionId: string,
	payload: AddCartItemPayload,
) {
	const quantity = Number(payload.quantity ?? 1);

	if (!payload.productDocumentId) {
		throw new Error("Missing productDocumentId.");
	}

	if (!payload.size) {
		throw new Error("Missing size.");
	}

	if (!Number.isInteger(quantity) || quantity < 1) {
		throw new Error("Invalid quantity.");
	}

	const cart = await getOrCreateActiveCart(sessionId);
	const product = await getProductByDocumentId(
		payload.productDocumentId,
		payload.locale,
	);

	if (!product?.documentId) {
		throw new Error("Product not found.");
	}

	const sizeField = SIZE_FIELD_MAP[payload.size];

	if (!product[sizeField]) {
		throw new Error("Selected size is not available.");
	}

	const existingItem = (cart.items ?? []).find(
		(item) =>
			item.slugSnapshot === product.slug && item.size === payload.size,
	);

	if (existingItem) {
		await strapiFetch(`/api/cart-items/${existingItem.documentId}`, {
			method: "PUT",
			body: JSON.stringify({
				data: {
					quantity: Number(existingItem.quantity) + quantity,
				},
			}),
		});
	} else {
		await strapiFetch("/api/cart-items", {
			method: "POST",
			body: JSON.stringify({
				data: {
					quantity,
					size: payload.size,
					unitPrice: Number(product.price),
					titleSnapshot: product.title,
					slugSnapshot: product.slug,
					imageSnapshot: extractProductImageUrl(product.image),
					cart: cart.documentId,
					product: product.documentId,
				},
			}),
		});
	}

	return getCartResponse(sessionId);
}

export async function updateCartItemQuantity(
	sessionId: string,
	itemDocumentId: string,
	quantity: number,
) {
	if (!Number.isInteger(quantity) || quantity < 1) {
		throw new Error("Quantity must be at least 1.");
	}

	const cart = await findActiveCart(sessionId);

	if (!cart) {
		return EMPTY_CART;
	}

	const ownsItem = (cart.items ?? []).some(
		(item) => item.documentId === itemDocumentId,
	);

	if (!ownsItem) {
		return normalizeCart(cart);
	}

	await strapiFetch(`/api/cart-items/${itemDocumentId}`, {
		method: "PUT",
		body: JSON.stringify({
			data: {
				quantity,
			},
		}),
	});

	return getCartResponse(sessionId);
}

export async function removeItemFromCart(
	sessionId: string,
	itemDocumentId: string,
) {
	const cart = await findActiveCart(sessionId);

	if (!cart) {
		return EMPTY_CART;
	}

	const ownsItem = (cart.items ?? []).some(
		(item) => item.documentId === itemDocumentId,
	);

	if (!ownsItem) {
		return normalizeCart(cart);
	}

	await strapiFetch(`/api/cart-items/${itemDocumentId}`, {
		method: "DELETE",
	});

	return getCartResponse(sessionId);
}

export async function clearCart(sessionId: string) {
	const cart = await findActiveCart(sessionId);

	if (!cart) {
		return EMPTY_CART;
	}

	const items = cart.items ?? [];

	if (!items.length) {
		return normalizeCart(cart);
	}

	await Promise.all(
		items.map((item) =>
			strapiFetch(`/api/cart-items/${item.documentId}`, {
				method: "DELETE",
			}),
		),
	);

	return getCartResponse(sessionId);
}
