"use client";
import MaxWidthWrapper from "../ui/MaxWidthWrapper";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { SIGNUP } from "./constants";
import type { SignupFormData } from "./types";
import { Link } from "@/src/i18n/routing";
export default function Signup() {
    const [form, setForm] = useState<SignupFormData>({
        email: "",
        password: "",
        name: "",
    });

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { id, value } = event.target;

        setForm((currentForm) => ({
            ...currentForm,
            [id]: value,
        }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log(form);
    }

    return (
        <MaxWidthWrapper>
            <form
                className="w-full flex flex-col h-200 justify-center  items-center text-black"
                onSubmit={handleSubmit}
            >
                <div className="bg-white shadow-xl justify-between rounded-2xl border-2 flex flex-col gap-5 p-5 py-12 md:p-10">
                    <h1 className="text-center justify-end text-6xl flex flex-col gap-4 ">
                        {SIGNUP.title} <p className="text-xl">{SIGNUP.desc}</p>
                    </h1>

                    <label htmlFor="email" className="">
                        {SIGNUP.nameTitle}
                    </label>
                    <input
                        id="name"
                        type="name"
                        placeholder={SIGNUP.namePlaceholder}
                        value={form.name}
                        onChange={handleChange}
                        className="md:w-100 w-80 border p-2 border-gray-200"
                    />
                    <label htmlFor="email" className="">
                        {SIGNUP.emailTitle}
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder={SIGNUP.emailPlaceholder}
                        value={form.email}
                        onChange={handleChange}
                        className="md:w-100 w-80 border p-2 border-gray-200"
                    />
                    <label htmlFor="password">{SIGNUP.passwordTitle}</label>
                    <input
                        id="password"
                        type="password"
                        placeholder={SIGNUP.passwordPlaceholder}
                        value={form.password}
                        onChange={handleChange}
                        className="md:w-100 w-80 border p-2 border-gray-200"
                    />
                    <button className="w-full text-white rounded-2xl p-2 bg-gray-700">
                        {SIGNUP.signup}
                    </button>
                    <Link
                        href={"/signin"}
                        className="w-full text-gray-500 mt-3 hover:text-gray-800 rounded-2xl text-center"
                    >
                        {SIGNUP.link}
                    </Link>
                </div>
            </form>
        </MaxWidthWrapper>
    );
}
