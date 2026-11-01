import { LogoSvg, type LogoProps } from "./logo-svg";

export function OpenClawLogo(props: LogoProps) {
  return (
    <LogoSvg viewBox="0 0 120 120" {...props}>
      <path
        fillRule="evenodd"
        d="M60 10C30 10 15 35 15 55C15 75 30 95 45 100L45 110L55 110L55 100C55 100 60 102 65 100L65 110L75 110L75 100C90 95 105 75 105 55C105 35 90 10 60 10ZM39 35a6 6 0 1 0 12 0a6 6 0 1 0 -12 0ZM69 35a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z"
      />
      <path d="M20 45C5 40 0 50 5 60C10 70 20 65 25 55C28 48 25 45 20 45Z" />
      <path d="M100 45C115 40 120 50 115 60C110 70 100 65 95 55C92 48 95 45 100 45Z" />
      <path
        d="M45 15Q35 5 30 8M75 15Q85 5 90 8"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <path
        d="M43.5 34a2.5 2.5 0 1 0 5.0 0a2.5 2.5 0 1 0 -5.0 0ZM73.5 34a2.5 2.5 0 1 0 5.0 0a2.5 2.5 0 1 0 -5.0 0Z"
        opacity={0.82}
      />
    </LogoSvg>
  );
}
