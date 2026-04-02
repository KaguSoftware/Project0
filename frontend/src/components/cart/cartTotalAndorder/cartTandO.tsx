"use client";

import Image from "next/image";
import MaxWidthWrapper from "../../ui/MaxWidthWrapper";
import { useCart } from "@/src/components/providers/CartProvider";
import { formatPrice } from "@/src/lib/formatter";
import { CARTTANDO } from "./constants";

export default function CartTandO() {
	const { cart, subtotal, clearCart, loading } = useCart();

	const hasItems = cart.items.length > 0;

	const whatsappLines = cart.items.map(
		(item, index) =>
			`${index + 1}. ${item.title} | Size: ${item.size} | Qty: ${
				item.quantity
			} | ${formatPrice(item.unitPrice * item.quantity)}`,
	);

	const whatsappText = encodeURIComponent(
		[
			CARTTANDO.buttonlink,
			...whatsappLines,
			"",
			`${CARTTANDO.total}${formatPrice(subtotal)}`,
		].join("\n"),
	);

	return (
		<MaxWidthWrapper>
			<div className="my-10 md:mt-2 items-center rounded-2xl flex flex-col md:grid-cols-3 bg-gray-200 gap-6 mx-auto md:p-8 p-3">
				<div className="bg-white font-bold w-full p-6 rounded-2xl">
					<h1 className="text-3xl border-b-2 py-2 border-gray-300">
						{CARTTANDO.summary}
					</h1>

					<div className="mt-4 space-y-2">
						{hasItems ? (
							cart.items.map((item) => (
								<h2
									key={item.documentId}
									className="text-base md:text-lg font-medium flex w-full justify-between gap-3"
								>
									<span className="truncate">
										{item.title} ({item.size}) x{" "}
										{item.quantity}
									</span>
									<span className="shrink-0">
										{formatPrice(
											item.unitPrice * item.quantity,
										)}
									</span>
								</h2>
							))
						) : (
							<p className="text-neutral-500 font-medium">
								Your cart is empty.
							</p>
						)}
					</div>

					<div className="flex justify-between text-2xl md:text-3xl mt-4 border-gray-300">
						<h3>{CARTTANDO.total}</h3>
						<h4 className="font-medium">{formatPrice(subtotal)}</h4>
					</div>

					<button
						type="button"
						onClick={() => void clearCart()}
						disabled={!hasItems || loading}
						className="mt-4 w-full rounded-full border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-800 disabled:opacity-50"
					>
						Clear cart
					</button>
				</div>

				<a
					href={
						hasItems
							? `https://wa.me/905372825347?text=${whatsappText}`
							: undefined
					}
					target="_blank"
					rel="noreferrer"
					className={`flex justify-center gap-3 md:text-xl text-[17px] font-bold text-white p-3 rounded-full w-full ${
						hasItems
							? "bg-green-500"
							: "bg-green-300 pointer-events-none"
					}`}
				>
					{CARTTANDO.wabutton}
					<Image
						src={"/icons/whatsapp.svg"}
						width={24}
						height={24}
						alt="wa logo"
						className="invert"
					/>
				</a>
			</div>
		</MaxWidthWrapper>
	);
}
