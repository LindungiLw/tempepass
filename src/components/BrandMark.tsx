import React from "react";

interface BrandMarkProps {
  className?: string;
  inverted?: boolean;
}

export function BrandMark({
  className = "h-9 w-9",
  inverted = false,
}: BrandMarkProps) {
  const shellFill = inverted ? "#FAF6EE" : "#24170E";
  const beanFill = inverted ? "#9A4D1A" : "#EBB44C";
  const accentStroke = inverted ? "#24170E" : "#FAF6EE";

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="11" fill={shellFill} />
      {/* QR finder corners framing a sliced tempe soybean mosaic */}
      <path
        d="M9 14V11C9 9.89543 9.89543 9 11 9H14"
        stroke={accentStroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M26 9H29C30.1046 9 31 9.89543 31 11V14"
        stroke={accentStroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M9 26V29C9 30.1046 9.89543 31 11 31H14"
        stroke={accentStroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M26 31H29C30.1046 31 31 30.1046 31 29V26"
        stroke={accentStroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Stylized golden soybeans bound inside mycelium matrix */}
      <ellipse
        cx="16.2"
        cy="16.2"
        rx="3.4"
        ry="2.5"
        transform="rotate(-24 16.2 16.2)"
        fill={beanFill}
      />
      <ellipse
        cx="24.2"
        cy="17"
        rx="3.1"
        ry="2.4"
        transform="rotate(28 24.2 17)"
        fill={beanFill}
      />
      <ellipse
        cx="17.2"
        cy="24.2"
        rx="3.2"
        ry="2.4"
        transform="rotate(18 17.2 24.2)"
        fill={beanFill}
      />
      <circle cx="24.5" cy="24.4" r="2.3" fill={accentStroke} />
    </svg>
  );
}
