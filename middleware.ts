import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req: NextRequest) {
    // you can add custom logic here if needed
  },
  {
    pages: {
      signIn: "/login",
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*"],
}
