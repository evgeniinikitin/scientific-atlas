import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary: "border-[var(--ink)] bg-[var(--ink)] px-5 py-3 text-[var(--paper)] hover:-translate-y-0.5 hover:bg-[var(--accent)] hover:border-[var(--accent)]",
        outline: "border-[var(--line-strong)] bg-transparent px-5 py-3 hover:border-[var(--ink)] hover:bg-[var(--surface)]",
        ghost: "border-transparent bg-transparent px-3 py-2 hover:bg-[var(--surface)]",
        icon: "size-10 border-[var(--line)] bg-[var(--paper)] hover:border-[var(--ink)] hover:bg-[var(--surface)]",
      },
      size: { default: "", sm: "text-xs px-3 py-2", lg: "text-base px-6 py-4" },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export function Button({ className, variant, size, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
