// src/app/actions/auth.ts
"use server";

import { cookies } from "next/headers";
import { getStrapiServerURL } from "@/src/lib/strapiServer";

export async function loginUser(prevState: any, formData: FormData) {
	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || !password) {
		return { error: "Please provide both email and password." };
	}

	try {
		const res = await fetch(getStrapiServerURL("/api/auth/local"), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				identifier: email,
				password: password,
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			return { error: data?.error?.message || "Invalid credentials." };
		}

		// Save the JWT in an HTTP-only cookie
		const cookieStore = await cookies();
		cookieStore.set({
			name: "strapi_jwt",
			value: data.jwt,
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 60 * 60 * 24 * 30, // 30 days
		});

		return { success: true };
	} catch (error) {
		console.error("Login error:", error);
		return { error: "Something went wrong trying to log in." };
	}
}
