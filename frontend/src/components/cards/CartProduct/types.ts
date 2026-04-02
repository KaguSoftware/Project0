import type { CartItem } from "@/src/types/cart";

export type cartProduct = CartItem;

export interface cartProductCardProps {
	product: cartProduct;
	compact?: boolean;
}
