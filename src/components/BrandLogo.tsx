"use client";
import Link from "next/link";
import { ShoppingBasket, Heart } from "lucide-react";

export default function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return <Link href="/" className={`lb-brand-logo ${compact ? "compact" : ""} ${className}`} aria-label="Little Basket home">
    <span className="lb-brand-logo-mark"><ShoppingBasket aria-hidden="true"/><Heart aria-hidden="true"/></span>
    <span className="lb-brand-logo-word">Little<span>Basket</span>{!compact && <small>For Little Moments, Big Happiness</small>}</span>
  </Link>;
}
