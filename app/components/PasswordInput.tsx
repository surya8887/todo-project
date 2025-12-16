"use client"

import { Eye, EyeOff } from "lucide-react"
import { forwardRef, useState } from "react"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ error, ...props }, ref) => {
    const [show, setShow] = useState(false)

    return (
      <div>
        <div className="relative">
          <input
            ref={ref}
            type={show ? "text" : "password"}
            className="w-full border rounded-md p-2 pr-10"
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2 top-2.5 text-gray-500"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    )
  }
)

PasswordInput.displayName = "PasswordInput"
export default PasswordInput
