"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { USERDATA, USERPAGE } from "./constants";
import { useTranslations } from "next-intl";

export default function UserPage() {
    const [showInfo, setShowInfo] = useState(false);
    const t = useTranslations();
    return (
        <div className="mx-auto flex max-w-md flex-col relative top-15 items-center gap-4 justify-between rounded-xl border bg-white p-6 h-160 shadow-sm">
            <h1 className="text-5xl flex flex-col items-center border mt-25 gap-4 p-4 rounded-full font-bold">
                <User className="size-12" />
            </h1>
            <h2 className="text-3xl">{t(USERPAGE.welcome)}</h2>
            <h3 className="text-4xl font-bold"> {t(USERDATA.User.name)}</h3>

            <div className="flex flex-col w-full gap-3 ">
                <Link
                    href="/profile"
                    className="rounded-lg bg-white px-4 py-2 text-center w-full border-2 transition text-xl hover:bg-red-200"
                >
                    {t(USERPAGE.liked)}
                </Link>
                <Link
                    href="/settings"
                    className="rounded-lg bg-white px-4 py-2 text-center w-full border-2 transition text-xl hover:bg-gray-100"
                >
                    {t(USERPAGE.cart)}
                </Link>
            </div>
            <div className="w-full flex flex-col gap-7 h-full">
                <button
                    type="button"
                    onClick={() => setShowInfo((prev) => !prev)}
                    className="rounded-lg bg-gray-600 px-4 py-2 text-center w-full text-xl text-white transition hover:bg-gray-700"
                >
                    {showInfo
                        ? `${t(USERPAGE.user.show)}`
                        : `${t(USERPAGE.user.hide)}`}
                </button>
                {showInfo && (
                    <div className="text-md">
                        <p>
                            <span className="font-semibold">
                                {t(USERPAGE.name)}:
                            </span>{" "}
                            {t(USERDATA.User.name)}
                        </p>
                        <p>
                            <span className="font-semibold">
                                {t(USERPAGE.last)}:
                            </span>{" "}
                            {t(USERDATA.User.lastName)}
                        </p>
                        <p>
                            <span className="font-semibold">
                                {t(USERPAGE.email)}:
                            </span>{" "}
                            {t(USERDATA.User.email)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
