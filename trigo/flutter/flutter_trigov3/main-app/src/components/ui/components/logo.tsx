export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#14b8a6" />
      <path d="M30 70 L50 30 L70 70" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="70" r="6" fill="white" />
      <circle cx="30" cy="70" r="6" fill="white" />
      <circle cx="70" cy="70" r="6" fill="white" />
    </svg>
  )
}

