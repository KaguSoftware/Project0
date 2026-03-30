import Navbar from "@/src/components/navbar/Navbar";

async function getNavbarCategories() {
	try {
		const res = await fetch(
			"http://127.0.0.1:1337/api/categories?filters[showInNavbar][$eq]=true",
			{ cache: "no-store" },
		);
		if (!res.ok) return [];
		const json = await res.json();
		return json.data;
	} catch (error) {
		console.error("Failed to fetch categories", error);
		return [];
	}
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const resolvedParams = await params;
	const locale = resolvedParams.locale;

	const categories = await getNavbarCategories();

	return (
		<html lang={locale}>
			<body>
				<Navbar strapiCategories={categories} />

				{children}
			</body>
		</html>
	);
}
