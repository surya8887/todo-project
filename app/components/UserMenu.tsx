"use client"

import { signOut, useSession } from "next-auth/react"

export default function UserMenu() {
  const { data: session } = useSession()

  return (
    <div className="flex items-center gap-4">
      {/* User Email */}
      <span className="text-sm text-neutral-300">
        {session?.user?.email}
      </span>

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="px-4 py-2 rounded-md bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition"
      >
        Logout
      </button>
    </div>
  )
}
