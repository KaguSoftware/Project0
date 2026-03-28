import Link from "next/link";
import { LOCATIONS } from "./constants";
import { Locationtype } from "./types";
import MaxWidthWrapper from "../../ui/MaxWidthWrapper";

export default function LocationCard() {
    return (
        <MaxWidthWrapper>
            <div className="grid grid-cols-1 min-h-screen items-center md:grid-cols-3 gap-6 mx-auto py-1 bg-white ">
                {LOCATIONS.map((location) => (
                    <div className="h-30 rounded-xl border-2 border-gray-400 flex flex-col justify-center text-center cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 hover:scale-105">
                        <h3 className="text-lg font-bold text-gray-500">
                            {location.adressName}
                        </h3>
                        <Link
                            href={location.adressLink}
                            className="text-gray-500 mt-1 hover:text-gray-400 text-sm"
                        >
                            {location.exactLocName}
                        </Link>
                    </div>
                ))}
            </div>
        </MaxWidthWrapper>
    );
}
