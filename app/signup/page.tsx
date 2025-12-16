"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema, SignupInput } from "@/app/lib/validations/auth"
import PasswordInput from "@/app/components/PasswordInput"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (res.ok) router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-32 -left-32 h-96 w-96 bg-purple-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 h-96 w-96 bg-blue-600/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Logo / Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 mb-4">
            <span className="text-xl font-bold">✓</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">
            Create your account
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Start managing your todos smarter
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <input
              {...register("name")}
              placeholder="Full name"
              className="w-full rounded-lg bg-neutral-800/70 border border-neutral-700 px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.name && (
              <p className="text-sm text-red-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              placeholder="Email address"
              className="w-full rounded-lg bg-neutral-800/70 border border-neutral-700 px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">
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

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg py-2.5 font-medium text-white 
                       bg-gradient-to-r from-purple-500 to-blue-500
                       hover:opacity-90 transition
                       disabled:opacity-50"
          >
            {isSubmitting ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-neutral-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
