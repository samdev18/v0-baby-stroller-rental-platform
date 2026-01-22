"use client"

import Link from "next/link"
import Image from "next/image"
import { useSettings } from "@/contexts/settings-context"

export function Logo() {
  const { companyName, logoUrl } = useSettings()

  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <div className="relative h-8 w-8 overflow-hidden">
        <Image src={logoUrl || "/logo.png"} alt={companyName} fill className="object-contain" />
      </div>
      <span className="text-lg font-semibold">{companyName}</span>
    </Link>
  )
}
