import CategoryGrid from "@/src/components/cards/CategoryCard/categoryGrid";
import { CATEGORIES } from "@/src/components/cards/CategoryCard/constants";
import LocationCard from "@/src/components/cards/LocationCard/LocationCard";
import MaxWidthWrapper from "@/src/components/ui/MaxWidthWrapper";

export default function Home() {
    return (
        <main>
            <MaxWidthWrapper>
                <CategoryGrid categories={CATEGORIES} />
                <LocationCard />
            </MaxWidthWrapper>
        </main>
    );
}
