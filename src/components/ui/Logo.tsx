"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-4 group", className)}>
      <Image
        src="/flaticon.svg"
        alt="BhulnaJaana Logo"
        width={36}
        height={36}
        className="transition-transform group-hover:scale-110 duration-500"
      />
      {showText && (
        <span className="font-black text-2xl tracking-tighter text-foreground uppercase border-l-2 border-border pl-4">
          BhulnaJaana
        </span>
      )}
    </Link>
  );
}
