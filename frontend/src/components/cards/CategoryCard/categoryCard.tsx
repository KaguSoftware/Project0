"use client";
import { CategoryProps } from "./types";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { DiscoverText } from "./constants";

const Cat = ({ category }: CategoryProps) => {
	const t = useTranslations();

	if (!category) return null;

	return (
		<Link
			href={category.moreLink}
			className="relative block w-auto md:h-90 h-60 bg-white overflow-hidden group cursor-pointer rounded-lg shadow-sm hover:shadow-md"
		>
			<Image
				src={category.imageUrl}
				alt={category.title}
				fill
				unoptimized
				className="object-cover transition-transform duration-500 group-hover:scale-102"
			/>

			<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/20" />

			<div className="absolute bottom-0 left-0 w-full flex flex-col item-center justify-center text-gray-200 z-10 p-4">
				<h3 className="text-4xl font-sans font-bold uppercase text-left tracking-widest text-gray-200">
					{category.title}
				</h3>

				<div className="flex items-center gap-2 mt-1 text-gray-200 group">
					<span className="text-sm mt-0.05 text-left mx-1 font-semibold text-gray-200">
						{t(DiscoverText.discover)}
					</span>
					<ArrowRight className="w-4 h-4 font-semibold transition-transform" />
				</div>
			</div>
		</Link>
	);
};

export default Cat;
