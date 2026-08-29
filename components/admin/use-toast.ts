"use client"

import { useEffect, useState } from "react"

export type ToastType = "success" | "error"

export type ToastMessage = {
  id: string
  message: string
  type: ToastType
}

const listeners = new Set<(toast: ToastMessage) => void>()

export function toast(message: string, type: ToastType = "success") {
  const t = { id: Math.random().toString(), message, type }
  listeners.forEach((l) => l(t))
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    const handleToast = (t: ToastMessage) => {
      setToasts((prev) => [...prev, t])
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== t.id))
      }, 4000)
    }

    listeners.add(handleToast)
    return () => {
      listeners.delete(handleToast)
    }
  }, [])

  return toasts
}
