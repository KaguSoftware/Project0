import CategoryGrid from "@/src/components/cards/CategoryCard/categoryGrid";
import { CATEGORIES } from "@/src/components/cards/CategoryCard/constants";
import LocationCard from "@/src/components/cards/LocationCard/LocationCard";
import MaxWidthWrapper from "@/src/components/ui/MaxWidthWrapper";
import ProductGrid from "@/src/components/productsGrid/products";
import ProductCarousel from "@/src/components/carousel/ProductCarousel";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
	try {
		const res = await fetch(
			"http://127.0.0.1:1337/api/products?filters[isFeatured][$eq]=true&populate=*",
			{ cache: "no-store" },
		);
		if (!res.ok) return { data: [] };
		return await res.json();
	} catch (error) {
		console.error("Failed to fetch featured products", error);
		return { data: [] };
	}
}

export default async function Home() {
	const strapiResponse = await getFeaturedProducts();

	const featuredProducts = strapiResponse.data.map((item: any) => {
		const imageUrl = item.image?.[0]?.url
			? `http://127.0.0.1:1337${item.image[0].url}`
			: "/placeholder-image.jpg";

		return {
			id: item.documentId,
			title: item.title,
			price: item.price,
			imageUrl: imageUrl,
			category: item.category?.name || "Uncategorized",
			slug: item.slug,
		};
	});

	return (
		<main>
			<MaxWidthWrapper>
				{/* Note: Categories are still hardcoded here, we can fix this next! */}
				<CategoryGrid categories={CATEGORIES} />

				{/* Pass your real Strapi data into the carousel and grid */}
				<ProductCarousel
					title="Featured Products"
					products={featuredProducts}
				/>
				<ProductGrid products={featuredProducts} />

				<LocationCard />
			</MaxWidthWrapper>
		</main>
	);
}
