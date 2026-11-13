import Image from "next/image";
import Link from "next/link";

export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="DeskFlow AI — home">
      <Image src="/logo.svg" alt="DeskFlow AI logo" width={36} height={36} priority />
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight text-ink-950">
          DeskFlow <span className="text-brand-600">AI</span>
        </span>
      )}
    </Link>
  );
}
