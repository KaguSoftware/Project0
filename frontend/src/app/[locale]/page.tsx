import CategoryGrid from "@/src/components/cards/CategoryCard/categoryGrid";
import LocationCard from "@/src/components/cards/LocationCard/LocationCard";
import MaxWidthWrapper from "@/src/components/ui/MaxWidthWrapper";
import ProductGrid from "@/src/components/productsGrid/products";
import ProductCarousel from "@/src/components/carousel/ProductCarousel";
import { getStrapiMedia, getStrapiURL } from "@/src/lib/strapi";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
	try {
		const res = await fetch(
			getStrapiURL(
				"/api/products?filters[isFeatured][$eq]=true&populate=*",
			),
			{ cache: "no-store" },
		);

		if (!res.ok) return { data: [] };
		return await res.json();
	} catch (error) {
		console.error("Failed to fetch featured products", error);
		return { data: [] };
	}
}

async function getHomepageCategories(locale: string) {
	try {
		const res = await fetch(
			getStrapiURL(`/api/categories?populate=*&locale=${locale}`),
			{ cache: "no-store" },
		);

		if (!res.ok) return { data: [] };
		return await res.json();
	} catch (error) {
		console.error("Failed to fetch homepage categories", error);
		return { data: [] };
	}
}

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	const [productsResponse, categoriesResponse] = await Promise.all([
		getFeaturedProducts(),
		getHomepageCategories(locale),
	]);

	const featuredProducts = productsResponse.data.map((item: any) => {
		const imagePath = Array.isArray(item.image)
			? item.image[0]?.url
			: item.image?.url;

		return {
			id: item.documentId,
			title: item.title,
			price: item.price,
			imageUrl: getStrapiMedia(imagePath),
			category: item.category?.name || "Uncategorized",
			slug: item.slug,
		};
	});

	const homepageCategories = categoriesResponse.data.map((item: any) => ({
		id: item.id,
		title: item.name,
		moreLink: `/products?category=${item.slug}`,
		imageUrl: getStrapiMedia(item.image?.url),
	}));

	return (
		<main>
			<MaxWidthWrapper>
				<CategoryGrid categories={homepageCategories} />

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
