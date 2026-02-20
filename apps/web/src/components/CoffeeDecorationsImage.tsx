import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { cn } from "@/lib/utils";

interface DecorationProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "dark-ink" | "light-ink";
}

export const CoffeeBranchImage = ({
  className,
  style,
  variant = "dark-ink",
}: DecorationProps) => (
  <div className={cn("relative", className)} style={style}>
    <CldImage
      src="coffee/images/decorations/coffee-branch-vintage"
      alt="Vintage coffee branch illustration"
      fill
      className={cn(
        "object-contain transition-all duration-700",
        variant === "dark-ink"
          ? "mix-blend-multiply opacity-80"
          : "filter invert opacity-20 mix-blend-screen brightness-150",
      )}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  </div>
);

export const CoffeeBeansScatteredImage = ({
  className,
  style,
  variant = "dark-ink",
}: DecorationProps) => (
  <div className={cn("relative", className)} style={style}>
    <CldImage
      src="coffee/images/decorations/coffee-beans-scattered"
      alt="Vintage scattered coffee beans illustration"
      fill
      className={cn(
        "object-contain transition-all duration-700",
        variant === "dark-ink"
          ? "mix-blend-multiply opacity-60"
          : "filter invert opacity-15 mix-blend-screen brightness-150",
      )}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  </div>
);

export const CoffeeLeafImage = ({
  className,
  style,
  variant = "dark-ink",
}: DecorationProps) => (
  <div className={cn("relative", className)} style={style}>
    <CldImage
      src="coffee/images/decorations/coffee-leaf-detailed"
      alt="Vintage coffee leaf illustration"
      fill
      className={cn(
        "object-contain transition-all duration-700",
        variant === "dark-ink"
          ? "mix-blend-multiply opacity-70"
          : "filter invert opacity-20 mix-blend-screen brightness-150",
      )}
      sizes="(max-width: 768px) 100vw, 500px"
    />
  </div>
);

export const JebenaImage = ({ className, style }: DecorationProps) => (
  <div className={`relative ${className}`} style={style}>
    <CldImage
      src="coffee/images/decorations/jebena"
      alt="Traditional Ethiopian Jebena pot"
      fill
      className="object-contain filter invert opacity-30 brightness-200"
      sizes="(max-width: 768px) 100vw, 500px"
    />
  </div>
);

export const CulturalPatternImage = ({ className, style }: DecorationProps) => (
  <div className={`relative ${className}`} style={style}>
    <CldImage
      src="coffee/images/decorations/ethiopian-pattern"
      alt="Traditional Ethiopian woven pattern"
      fill
      className="object-cover opacity-15 grayscale brightness-200"
      sizes="100vw"
    />
  </div>
);
