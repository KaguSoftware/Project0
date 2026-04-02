"use client";

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { AddCartItemPayload, CartResponse } from "@/src/types/cart";
import { EMPTY_CART } from "@/src/types/cart";

type CartContextValue = CartResponse & {
	loading: boolean;
	refreshCart: () => Promise<CartResponse>;
	addItem: (payload: AddCartItemPayload) => Promise<CartResponse>;
	updateItemQuantity: (
		itemDocumentId: string,
		quantity: number,
	) => Promise<CartResponse>;
	removeItem: (itemDocumentId: string) => Promise<CartResponse>;
	clearCart: () => Promise<CartResponse>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

async function readCartResponse(response: Response) {
	const payload = await response.json();

	if (!response.ok) {
		throw new Error(payload?.error || "Cart request failed.");
	}

	return payload as CartResponse;
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [cartData, setCartData] = useState<CartResponse>(EMPTY_CART);
	const [loading, setLoading] = useState(true);

	const refreshCart = useCallback(async () => {
		setLoading(true);

		try {
			const response = await fetch("/api/cart", {
				method: "GET",
				cache: "no-store",
			});

			const data = await readCartResponse(response);
			setCartData(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const addItem = useCallback(async (payload: AddCartItemPayload) => {
		setLoading(true);

		try {
			const response = await fetch("/api/cart/items", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await readCartResponse(response);
			setCartData(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const updateItemQuantity = useCallback(
		async (itemDocumentId: string, quantity: number) => {
			setLoading(true);

			try {
				const response = await fetch(
					`/api/cart/items/${itemDocumentId}`,
					{
						method: "PATCH",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ quantity }),
					},
				);

				const data = await readCartResponse(response);
				setCartData(data);
				return data;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const removeItem = useCallback(async (itemDocumentId: string) => {
		setLoading(true);

		try {
			const response = await fetch(`/api/cart/items/${itemDocumentId}`, {
				method: "DELETE",
			});

			const data = await readCartResponse(response);
			setCartData(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	const clearCart = useCallback(async () => {
		setLoading(true);

		try {
			const response = await fetch("/api/cart", {
				method: "DELETE",
			});

			const data = await readCartResponse(response);
			setCartData(data);
			return data;
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void refreshCart();
	}, [refreshCart]);

	const value = useMemo<CartContextValue>(
		() => ({
			...cartData,
			loading,
			refreshCart,
			addItem,
			updateItemQuantity,
			removeItem,
			clearCart,
		}),
		[
			cartData,
			loading,
			refreshCart,
			addItem,
			updateItemQuantity,
			removeItem,
			clearCart,
		],
	);

	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);

	if (!context) {
		throw new Error("useCart must be used inside CartProvider.");
	}

	return context;
}
