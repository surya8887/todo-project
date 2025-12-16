"use client"

import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginInput } from "@/app/lib/validations/auth"
import PasswordInput from "@/app/components/PasswordInput"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    setError(null)

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (res?.error) {
      setError("Invalid email or password")
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 h-96 w-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 h-96 w-96 bg-blue-600/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">

        {/* Logo / Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
            <span className="text-xl font-bold">🔐</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <input
              {...register("email")}
              placeholder="Email address"
              className="w-full rounded-lg bg-neutral-800/70 border border-neutral-700 px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <PasswordInput
            {...register("password")}
            placeholder="Password"
            error={errors.password?.message}
            className="bg-neutral-800/70 border-neutral-700 text-white placeholder-neutral-500 focus:ring-purple-500"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg py-2.5 font-medium text-white 
                       bg-gradient-to-r from-purple-500 to-blue-500
                       hover:opacity-90 transition
                       disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-xs text-neutral-500">OR</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* OAuth */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 border border-neutral-700 rounded-lg py-2.5 text-sm hover:bg-neutral-800 transition"
        >
          <span>Continue with Google</span>
        </button>

        {/* Footer */}
        <p className="text-sm text-center text-neutral-400 mt-6">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-white font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}
