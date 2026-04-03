"use server";
import z from "zod";
import { cookies } from "next/headers";
const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
});
export async function CreateUserAction(prevState: any, formData: FormData) {
    console.log("Creating user...");
    console.log("submitted form data:", Object.fromEntries(formData.entries()));

    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    const result = CreateUserSchema.safeParse({ email, password, name });
    console.log(
        "validation field errors:",
        result.success ? null : result.error.flatten().fieldErrors
    );

    if (!result.success) {
        console.error("Validation failed:", result.error.flatten().fieldErrors);

        return {
            ...prevState,
            ZodError: result.error.flatten().fieldErrors,
            strapiError: null,
            errorMessage: "Please fix the highlighted fields.",
            success: false,
            successMessage: null,
            jwt: null,
            user: null,
        };
    }

    try {
        const strapiUrl = "http://localhost:1337/api/auth/local/register";
        console.log("Sending signup request to:", strapiUrl);
        console.log("Signup payload:", {
            username: result.data.name,
            email: result.data.email,
            password: "[REDACTED]",
        });

        const response = await fetch(strapiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: result.data.name,
                email: result.data.email,
                password: result.data.password,
            }),
            cache: "no-store",
        });

        const rawText = await response.text();
        let data: any = null;

        try {
            data = rawText ? JSON.parse(rawText) : null;
        } catch {
            data = rawText;
        }

        console.log("Strapi status:", response.status);
        console.log(
            "Strapi headers:",
            Object.fromEntries(response.headers.entries())
        );
        console.log("Strapi raw response:", rawText);
        console.log("Strapi parsed response:", data);

        if (response.ok && data?.jwt && data?.user) {
            const cookieStore = await cookies();

            cookieStore.set("jwt", data.jwt, {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            cookieStore.set("userId", String(data.user.id), {
                httpOnly: false,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            cookieStore.set("username", data.user.username ?? "", {
                httpOnly: false,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            cookieStore.set("userEmail", data.user.email ?? "", {
                httpOnly: false,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });
        }

        if (!response.ok) {
            return {
                ...prevState,
                ZodError: null,
                strapiError: data?.error ?? data ?? null,
                errorMessage: data?.error?.message ?? "Failed to create user.",
                success: false,
                successMessage: null,
                jwt: null,
                user: null,
            };
        }

        return {
            ...prevState,
            ZodError: null,
            strapiError: null,
            errorMessage: null,
            success: true,
            successMessage: "User created successfully.",
            jwt: data?.jwt ?? null,
            user: data?.user ?? null,
        };
    } catch (error) {
        console.error("Create user error:", error);

        return {
            ...prevState,
            ZodError: null,
            strapiError: null,
            errorMessage: "Could not connect to Strapi.",
            success: false,
            successMessage: null,
            jwt: null,
            user: null,
        };
    }
}
