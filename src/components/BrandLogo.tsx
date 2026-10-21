"use client";
import Link from "next/link";

export default function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <Link href="/" className={`lb-brand-logo ${compact ? "compact" : ""} ${className}`} aria-label="Little Basket home">
    <img className="lb-brand-logo-full" src="/category-images/branding/Little%20Basket%20Baby%20Logo.png" alt="Little Basket — For Little Moments, Big Happiness" />
  </Link>;
}
