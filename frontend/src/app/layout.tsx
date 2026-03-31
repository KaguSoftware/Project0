import React from "react";

type NavbarCategory = {
    id?: number;
    documentId?: string;
    name?: string;
    slug?: string;
    showInNavbar?: boolean;
    isMegaMenu?: boolean;
    megaMenuContent?: unknown;
    locale?: string;
    image?: unknown;
};

type NavbarProps = {
    strapiCategories?: NavbarCategory[];
};

export default function Navbar({ strapiCategories = [] }: NavbarProps) {
    // existing logic and JSX remain unchanged
    return (
        <nav>
            {/* Render navbar items using strapiCategories */}
            {strapiCategories.map((category) => (
                <a
                    key={category.id ?? category.documentId}
                    href={`/${category.slug}`}
                >
                    {category.name}
                </a>
            ))}
        </nav>
    );
}
