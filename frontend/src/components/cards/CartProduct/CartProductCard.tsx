"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/routing";
import { cartProductCardProps } from "./types";
import MaxWidthWrapper from "../../ui/MaxWidthWrapper";
import { Trash } from "lucide-react";

export default function CartProductCard({ product }: cartProductCardProps) {
    const t = useTranslations();

    return (
        <MaxWidthWrapper>
            <div className="flex max-h-fit h-full w-auto bg-black/2 rounded-2xl">
                <div className="size-42 md:w-[20%] min-w-18 w-24 h-fit">
                    {/* yall will prolly say wtf , basically the dimentions dont change this way sorry that it looks ass */}
                    <Link
                        className="rounded-2xl object-cover"
                        href={`/products/${product.id}`}
                    >
                        <Image
                            src={product.imageUrl}
                            alt={product.title}
                            width={300}
                            height={400}
                            className="rounded-2xl"
                        />
                    </Link>
                </div>
                <div className=" flex p-2 justify-center w-full h-full">
                    <div className="flex md:flex-col justify-between w-full">
                        <h3 className="text-xl font-bold text-black line-clamp-2">
                            {t(product.title)} wiusdbcv sdiuvcb sudgc jkbsdc
                        </h3>
                        <p className=" self-center md:mr-auto text-gray-700 font-bold bg-gray-50 w-fit h-fit md:px-6 px-2 rounded-full">
                            {product.size}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <h2 className="text-black self-center font-bold">
                            ₺{product.currentPrice}
                        </h2>
                        <button>
                            <Trash className="text-red-400 md:size-6 size-7" />
                        </button>
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
