"use client";
import MaxWidthWrapper from "../ui/MaxWidthWrapper";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { SIGNIN } from "./constants";
import type { SigninFormData } from "./types";
import { Link, useRouter } from "@/src/i18n/routing";
import { loginUser } from "@/src/app/actions/auth";

export default function SignIn() {
	const router = useRouter();
	const [form, setForm] = useState<SigninFormData>({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { id, value } = event.target;
		setForm((currentForm) => ({
			...currentForm,
			[id]: value,
		}));
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData();
		formData.append("email", form.email);
		formData.append("password", form.password);

		const result = await loginUser(null, formData);

		if (result.error) {
			setError(result.error);
			setLoading(false);
		} else if (result.success) {
			// Successful login, redirect to home or cart
			router.push("/");
			router.refresh();
		}
	}

	return (
		<MaxWidthWrapper>
			<form
				className="w-full flex flex-col h-200 justify-center items-center text-black"
				onSubmit={handleSubmit}
			>
				<div className="bg-white shadow-xl justify-between rounded-2xl border-2 flex flex-col gap-5 p-5 py-12 md:p-10">
					<h1 className="text-center justify-end text-6xl flex flex-col gap-4 ">
						{SIGNIN.title} <p className="text-xl">{SIGNIN.desc}</p>
					</h1>

					{error && (
						<div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
							{error}
						</div>
					)}

					<label htmlFor="email">{SIGNIN.emailTitle}</label>
					<input
						id="email"
						type="email"
						required
						placeholder={SIGNIN.emailPlaceholder}
						value={form.email}
						onChange={handleChange}
						className="md:w-100 w-80 border p-2 border-gray-200"
					/>

					<label htmlFor="password">{SIGNIN.passwordTitle}</label>
					<input
						id="password"
						type="password"
						required
						placeholder={SIGNIN.passwordPlaceholder}
						value={form.password}
						onChange={handleChange}
						className="md:w-100 w-80 border p-2 border-gray-200"
					/>

					<button
						disabled={loading}
						className="w-full text-white rounded-2xl p-2 bg-gray-700 disabled:opacity-50"
					>
						{loading ? "Signing in..." : SIGNIN.signin}
					</button>

					<Link
						href={"/signup"}
						className="w-full text-gray-500 mt-3 hover:text-gray-800 rounded-2xl text-center"
					>
						{SIGNIN.link}
					</Link>
				</div>
			</form>
		</MaxWidthWrapper>
	);
}
