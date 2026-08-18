import Link from "next/link";
import { Feather, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Feather className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            404 — Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The page, writing, or author profile you were looking for does not exist, or has been kept private by its author.
          </p>
        </div>
        <Link href="/dashboard" className="inline-block">
          <Button className="rounded-full gap-2 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Discover</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
