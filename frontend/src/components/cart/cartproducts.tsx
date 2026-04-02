"use client";

import type { CartItem } from "@/src/types/cart";
import CartProductCard from "../cards/CartProduct/CartProductCard";

interface CartProductGridProps {
	cartproducts: CartItem[];
	compact?: boolean;
}

const CartProductGrid = ({
	cartproducts,
	compact = false,
}: CartProductGridProps) => {
	if (!cartproducts.length) {
		return (
			<div
				className={`rounded-2xl border border-dashed border-neutral-300 text-neutral-500 ${
					compact ? "p-4 text-sm" : "p-6"
				}`}
			>
				Your cart is empty.
			</div>
		);
	}

	return (
		<div
			className={`grid z-0 ${
				compact ? "gap-3 p-0" : "md:p-3 p-0 md:gap-5 gap-3"
			}`}
		>
			{cartproducts.map((product) => (
				<CartProductCard
					key={product.documentId}
					product={product}
					compact={compact}
				/>
			))}
		</div>
	);
};

export default CartProductGrid;
