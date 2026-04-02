"use client";

import Image from "next/image";
import { Link } from "@/src/i18n/routing";
import { Trash } from "lucide-react";
import { useState } from "react";
import { cartProductCardProps } from "./types";
import { useCart } from "@/src/components/providers/CartProvider";
import { formatPrice } from "@/src/lib/formatter";

export default function CartProductCard({
	product,
	compact = false,
}: cartProductCardProps) {
	const { updateItemQuantity, removeItem } = useCart();
	const [pending, setPending] = useState(false);

	const handleDecrease = async () => {
		if (pending || product.quantity <= 1) return;

		setPending(true);
		try {
			await updateItemQuantity(product.documentId, product.quantity - 1);
		} finally {
			setPending(false);
		}
	};

	const handleIncrease = async () => {
		if (pending) return;

		setPending(true);
		try {
			await updateItemQuantity(product.documentId, product.quantity + 1);
		} finally {
			setPending(false);
		}
	};

	const handleRemove = async () => {
		if (pending) return;

		setPending(true);
		try {
			await removeItem(product.documentId);
		} finally {
			setPending(false);
		}
	};

	return (
		<div
			className={`flex h-full w-full rounded-2xl bg-black/2 ${
				compact ? "gap-3 p-2" : "gap-4 p-3"
			}`}
		>
			<div
				className={compact ? "w-20 shrink-0" : "w-24 md:w-40 shrink-0"}
			>
				<Link
					className="block rounded-2xl overflow-hidden"
					href={`/products/${product.slug}`}
				>
					<Image
						src={product.imageUrl}
						alt={product.title}
						width={300}
						height={400}
						className="rounded-2xl w-full h-auto object-cover"
					/>
				</Link>
			</div>

			<div className="flex justify-between w-full gap-3">
				<div className="flex flex-col justify-between">
					<div>
						<h3
							className={`font-bold text-black ${
								compact ? "text-sm" : "md:text-2xl text-sm"
							}`}
						>
							{product.title}
						</h3>

						<p
							className={`mt-2 text-gray-700 font-bold bg-gray-50 w-fit rounded-full ${
								compact
									? "text-xs px-3 py-1"
									: "text-sm md:text-lg px-4 py-1"
							}`}
						>
							{product.size}
						</p>
					</div>

					<div className="flex items-center gap-2 mt-3">
						<button
							type="button"
							onClick={handleDecrease}
							disabled={pending || product.quantity <= 1}
							className="h-8 w-8 rounded-full border border-neutral-300 disabled:opacity-40"
						>
							-
						</button>

						<span className="min-w-6 text-center font-bold">
							{product.quantity}
						</span>

						<button
							type="button"
							onClick={handleIncrease}
							disabled={pending}
							className="h-8 w-8 rounded-full border border-neutral-300 disabled:opacity-40"
						>
							+
						</button>
					</div>
				</div>

				<div className="flex flex-col items-end justify-between">
					<div className="text-right">
						<p className="text-xs text-neutral-500">
							{formatPrice(product.unitPrice)} x{" "}
							{product.quantity}
						</p>
						<h2
							className={`text-black font-bold ${
								compact ? "text-sm" : "md:text-xl text-sm"
							}`}
						>
							{formatPrice(product.unitPrice * product.quantity)}
						</h2>
					</div>

					<button
						type="button"
						onClick={handleRemove}
						disabled={pending}
					>
						<Trash
							className={`text-red-400 ${
								compact ? "size-5" : "md:size-8 size-6"
							}`}
						/>
					</button>
				</div>
			</div>
		</div>
	);
}
