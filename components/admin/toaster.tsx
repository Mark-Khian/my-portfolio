"use client"

import { useToast } from "./use-toast"
import { CheckCircle2, XCircle } from "lucide-react"

export function Toaster() {
  const toasts = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md transition-all duration-300 ${
            t.type === "success"
              ? "border-emerald-500/30 bg-[#064e3b]/90 text-emerald-400"
              : "border-red-500/30 bg-[#7f1d1d]/90 text-red-400"
          }`}
        >
          {t.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {t.message}
        </div>
      ))}
    </div>
  )
}
