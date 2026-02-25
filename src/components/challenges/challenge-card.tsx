import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  title: string;
  description: string;
  outcome?: string;
  children: ReactNode;
  className?: string;
}

export function ChallengeCard({
  title,
  description,
  outcome,
  children,
  className,
}: ChallengeCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-sm p-5 space-y-4 hover:border-primary/20 transition-colors duration-100",
        className
      )}
    >
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
      {children}
      {outcome && (
        <div className="pt-2 border-t border-border/60">
          <p className="text-sm font-medium text-[color:var(--success)]">{outcome}</p>
        </div>
      )}
    </div>
  );
}
