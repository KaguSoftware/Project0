export type CartSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type CartItem = {
	documentId: string;
	title: string;
	slug: string;
	imageUrl: string;
	size: CartSize;
	quantity: number;
	unitPrice: number;
};

export type Cart = {
	documentId: string | null;
	sessionId: string | null;
	items: CartItem[];
};

export type CartResponse = {
	cart: Cart;
	itemCount: number;
	subtotal: number;
};

export type AddCartItemPayload = {
	productDocumentId: string;
	size: CartSize;
	quantity?: number;
	locale?: string;
};

export const EMPTY_CART: CartResponse = {
	cart: {
		documentId: null,
		sessionId: null,
		items: [],
	},
	itemCount: 0,
	subtotal: 0,
};
