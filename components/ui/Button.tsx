import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

const variantStyle = {
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  positive:
    "bg-[#264133] text-white  hover:bg-[#2F5140] focus-visible:outline-dark-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  normal:
    "bg-light-400 dark:text-dark-300 dark:bg-light-100/90 text-light-50 hover:bg-light-400/60 focus-visible:outline-dark-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  modest:
    "bg-light-300 border dark:text-light-50 text-light-50 hover:bg-light-300/80 dark:bg-white/10 dark:hover:bg-white/20",
};

interface ButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant: "modest" | "normal" | "positive" | "danger";
  children: ReactNode;
  className?: string;
  href?: string;
  disabled?: boolean;
}

interface LinkProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "modest" | "normal" | "positive" | "danger";
  children: ReactNode;
  className?: string;
  href?: string;
}

const Button = ({
  variant,
  children,
  className,
  href,
  title,
  ...props
}: ButtonProps & LinkProps) => {
  className = clsx(
    "rounded-md px-3 py-2 text-sm font-semibold  shadow-sm",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    variantStyle[variant],
    className,
  );
  return href ? (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  ) : (
    <button className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;
