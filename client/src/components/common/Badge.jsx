// Reusable badge chip — used for genres, types, scores
const variants = {
  orange: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  green: "bg-green-500/20  text-green-400  border border-green-500/30",
  blue: "bg-blue-500/20   text-blue-400   border border-blue-500/30",
  purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  gray: "bg-white/10      text-gray-300   border border-white/10",
};

export default function Badge({ children, variant = "gray", className = "" }) {
  return (
    <span
      className={`
      inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
      ${variants[variant]} ${className}
    `}
    >
      {children}
    </span>
  );
}
