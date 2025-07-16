export default function VigloviaLogo({
  className = "h-8",
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-[#321E5D]">vigovia</h1>
        <p className="text-sm text-[#680099] font-medium tracking-wider">
          PLAN.PACK.GO
        </p>
      </div>
      <div className="ml-2">
        <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
          <path
            d="M35 12L40 8L35 4"
            stroke="#321E5D"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M0 8H38"
            stroke="#321E5D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
