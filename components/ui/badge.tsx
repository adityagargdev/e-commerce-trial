import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold tracking-wide",
  {
    variants: {
      variant: {
        discount: "bg-red-500 text-white",
        new: "bg-green-600 text-white",
        popular: "bg-amber-500 text-white",
        out: "bg-gray-400 text-white",
        offer: "bg-orange-500 text-white",
      },
    },
    defaultVariants: { variant: "discount" },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
