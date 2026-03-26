import Image from 'next/image'; // core nextjs
import Link from 'next/link'; // for rooting 
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { Heart } from 'lucide-react';

export default function ProductCard() {
    return (
        <div>
            <Image
                src="/mock-images/mockpants.png"
                alt="Vamos Korean Style Pants"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-102 "
            //group-hover:scale-105 and transition-transform duration-300 - might be removed/goes together for smoothness
            />

            <button className="absolute top-3 right-3 border-text-gray hover:text-pink-500">
                <Heart className="w-s h-s" />
            </button>


        </div>
    )
}