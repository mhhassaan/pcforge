"use client"

import { motion, useScroll, type MotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  ref?: React.Ref<HTMLDivElement>
  container?: React.RefObject<HTMLElement | null>
}

export function ScrollProgress({
  className,
  ref,
  container,
  ...props
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll(container ? { container } : {})

  // Debug: Monitor scroll progress in console to ensure it's firing
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      // Small log to confirm tracking without spamming
      if (v > 0 && v < 0.01) console.log("Scroll Progress Active");
    })
  }, [scrollYProgress])

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-[10000] h-1 origin-left bg-blue-600 drop-shadow-[0_2px_8px_rgba(37,99,235,0.8)]",
        className
      )}
      style={{
        scaleX: scrollYProgress,
      }}
      {...props}
    />
  )
}
