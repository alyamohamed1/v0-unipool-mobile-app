export function UnipoolLogo({ className = "", variant = "default" }: { className?: string; variant?: "default" | "white" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src={variant === "white" 
          ? "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%2015-Zz4QfYF5WlchRjJ6QNKF0IJXEI3hOo.png"
          : "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%205-DOfEfEb5N5QcULK5nmwrTXqR900QTb.png"
        }
        alt="UNIPOOL Logo" 
        className="h-full w-auto object-contain"
      />
    </div>
  )
}
