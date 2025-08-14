import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  href: string;
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export const EmptyState = ({
  icon,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-5 sm:gap-6 sm:px-5 sm:py-6">
      <div className="flex flex-col items-center gap-2 sm:gap-3">
        <div className="bg-accent/50 rounded-full p-3 sm:p-4">
          <div className="text-primary size-16 sm:size-20">{icon}</div>
        </div>
        <p className="text-center text-base font-bold sm:text-lg">{title}</p>
        {subtitle && (
          <span className="text-muted-foreground flex items-center gap-1 text-center text-xs font-medium sm:gap-2 sm:text-sm">
            {subtitle}
          </span>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div className="flex w-full max-w-xs flex-col gap-2 sm:max-w-sm sm:flex-row">
          {primaryAction && (
            <Button
              asChild
              className="flex-1 gap-2 rounded-full py-3 text-xs sm:text-sm"
            >
              <Link href={primaryAction.href}>
                {primaryAction.icon}
                {primaryAction.label}
              </Link>
            </Button>
          )}
          {secondaryAction && (
            <Button
              asChild
              variant={secondaryAction.variant ?? "outline"}
              className="flex-1 gap-2 rounded-full py-3 text-xs sm:text-sm"
            >
              <Link href={secondaryAction.href}>
                {secondaryAction.icon}
                {secondaryAction.label}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
