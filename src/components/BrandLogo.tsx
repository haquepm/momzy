"use client";
import Link from "next/link";

export default function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <Link href="/" className={`lb-brand-logo ${compact ? "compact" : ""} ${className}`} aria-label="Little Basket home">
    <span className="lb-brand-logo-mark"><img src="/category-images/branding/little-basket-emblem.webp" alt="" /></span>
    <span className="lb-brand-logo-word">Little<span>Basket</span>{!compact && <small>For Little Moments, Big Happiness</small>}</span>
  </Link>;
}
