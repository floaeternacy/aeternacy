
import React from 'react';

// Added TokenIconProps to include the 'size' property for layout flexibility
interface TokenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ size, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <text
        x="12"
        y="16" 
        fontFamily="'SF Pro', 'Inter', system-ui, -apple-system, sans-serif"
        fontSize="12"
        fontWeight="bold"
        fill="currentColor"
        textAnchor="middle"
        stroke="none"
    >
      æ
    </text>
  </svg>
);

export default TokenIcon;
