"use client";

import CartProductGrid from "@/src/components/cart/cartproducts";
import CartTandO from "@/src/components/cart/cartTotalAndorder/cartTandO";
import { useCart } from "@/src/components/providers/CartProvider";

export default function CartPage() {
	const { cart, loading } = useCart();

	return (
		<main className="md:p-4 py-4 md:grid md:grid-cols-3 justify-between w-full">
			<div className="col-span-2">
				{loading && cart.items.length === 0 ? (
					<div className="px-6 py-10 text-neutral-500">
						Loading cart...
					</div>
				) : (
					<CartProductGrid cartproducts={cart.items} />
				)}
			</div>

			<div className="w-full">
				<CartTandO />
			</div>
		</main>
	);
}
