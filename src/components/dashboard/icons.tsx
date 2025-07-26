import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8v10c0 1.1.9 2 2 2h4" />
      <path d="M20 10h-6" />
      <path d="M12 10V4" />
      <path d="m16 16 2 2 4-4" />
    </svg>
  );
}
