"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PRODUCTPAGE } from "@/src/app/[locale]/products/[slug]/constants";
import { useCart } from "@/src/components/providers/CartProvider";
import type { CartSize } from "@/src/types/cart";

type SizeOption = {
	label: CartSize;
	isAvailable: boolean;
};

interface AddToCartSectionProps {
	productDocumentId: string;
	sizeOptions: SizeOption[];
}

export default function AddToCartSection({
	productDocumentId,
	sizeOptions,
}: AddToCartSectionProps) {
	const t = useTranslations();
	const locale = useLocale();
	const { addItem } = useCart();

	const firstAvailableSize = useMemo(
		() => sizeOptions.find((size) => size.isAvailable)?.label ?? null,
		[sizeOptions],
	);

	const [selectedSize, setSelectedSize] = useState<CartSize | null>(
		firstAvailableSize,
	);
	const [pending, setPending] = useState(false);
	const [feedback, setFeedback] = useState("");

	useEffect(() => {
		if (!selectedSize && firstAvailableSize) {
			setSelectedSize(firstAvailableSize);
		}
	}, [firstAvailableSize, selectedSize]);

	const handleAddToCart = async () => {
		if (!selectedSize || pending) return;

		setPending(true);
		setFeedback("");

		try {
			await addItem({
				productDocumentId,
				size: selectedSize,
				quantity: 1,
				locale,
			});

			setFeedback("Added to cart.");
		} catch (error) {
			setFeedback(
				error instanceof Error
					? error.message
					: "Failed to add to cart.",
			);
		} finally {
			setPending(false);
		}
	};

	return (
		<>
			<div className="flex gap-8 mt-4">
				<div>
					<h3 className="text-gray-700 font-bold tracking-tight text-lg">
						{t(PRODUCTPAGE.sizetext)}
					</h3>

					<div className="flex font-bold mt-2 gap-2 flex-wrap">
						{sizeOptions.map((size) => {
							const isSelected = selectedSize === size.label;

							return (
								<button
									key={size.label}
									type="button"
									disabled={!size.isAvailable || pending}
									onClick={() => setSelectedSize(size.label)}
									className={`h-10 w-10 border rounded-lg duration-150 flex items-center justify-center ${
										!size.isAvailable
											? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
											: isSelected
												? "border-black bg-black text-white"
												: "border-gray-400 text-black hover:bg-black hover:text-white cursor-pointer"
									}`}
								>
									{size.label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4 mt-6 font-bold">
				<button
					type="button"
					onClick={handleAddToCart}
					disabled={!selectedSize || pending}
					className={`rounded-xl duration-300 shadow-xl h-14 ${
						!selectedSize || pending
							? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
							: "text-black bg-neutral-100 hover:bg-black hover:text-white"
					}`}
				>
					{pending ? "Adding..." : t(PRODUCTPAGE.addtocart)}
				</button>

				{feedback ? (
					<p className="text-sm text-neutral-600">{feedback}</p>
				) : null}
			</div>
		</>
	);
}
