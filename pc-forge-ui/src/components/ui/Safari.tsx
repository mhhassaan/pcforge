import type { HTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/utils"

const SAFARI_WIDTH = 1203
const SAFARI_HEIGHT = 753
const SCREEN_X = 1
const SCREEN_Y = 52
const SCREEN_WIDTH = 1200
const SCREEN_HEIGHT = 700

// Calculated percentages
const LEFT_PCT = (SCREEN_X / SAFARI_WIDTH) * 100
const TOP_PCT = (SCREEN_Y / SAFARI_HEIGHT) * 100
const WIDTH_PCT = (SCREEN_WIDTH / SAFARI_WIDTH) * 100
const HEIGHT_PCT = (SCREEN_HEIGHT / SAFARI_HEIGHT) * 100

type SafariMode = "default" | "simple"

export interface SafariProps extends HTMLAttributes<HTMLDivElement> {
  url?: string
  imageSrc?: string
  videoSrc?: string
  mode?: SafariMode
  children?: ReactNode
}

export function Safari({
  imageSrc,
  videoSrc,
  url = "pcforge.pk/system-parity",
  children,
  mode = "default",
  className,
  style,
  ...props
}: SafariProps) {
  const hasVideo = !!videoSrc
  const hasImage = !!imageSrc
  const hasMedia = hasVideo || hasImage || !!children

  return (
    <div
      className={cn("relative inline-block w-full align-middle leading-none", className)}
      style={{
        aspectRatio: `${SAFARI_WIDTH}/${SAFARI_HEIGHT}`,
        ...style,
      }}
      {...props}
    >
      {/* Content Area */}
      <div
        className="absolute z-0 overflow-hidden"
        style={{
          left: `${LEFT_PCT}%`,
          top: `${TOP_PCT}%`,
          width: `${WIDTH_PCT}%`,
          height: `${HEIGHT_PCT}%`,
          borderRadius: "0 0 11px 11px",
        }}
      >
        {hasVideo && (
          <video
            className="block size-full object-cover"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
        )}

        {!hasVideo && imageSrc && (
          <img
            src={imageSrc}
            alt=""
            className="block size-full object-cover object-top"
          />
        )}

        {!hasVideo && !imageSrc && children}
      </div>

      {/* Safari Frame (SVG Overlay) */}
      <svg
        viewBox={`0 0 ${SAFARI_WIDTH} ${SAFARI_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 z-10 size-full pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      >
        <defs>
          <mask id="safariPunch" maskUnits="userSpaceOnUse">
            <rect
              x="0"
              y="0"
              width={SAFARI_WIDTH}
              height={SAFARI_HEIGHT}
              fill="white"
            />
            <path
              d="M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z"
              fill="black"
            />
          </mask>

          <clipPath id="path0">
            <rect width={SAFARI_WIDTH} height={SAFARI_HEIGHT} fill="white" />
          </clipPath>
        </defs>

        <g
          clipPath="url(#path0)"
          mask={hasMedia ? "url(#safariPunch)" : undefined}
        >
          {/* Main background of the browser chrome */}
          <path
            d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z"
            className="fill-gray-100 dark:fill-[#1a1a1a]"
          />
          {/* Top Bar background */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z"
            className="fill-gray-200 dark:fill-[#121212]"
          />
          {/* URL Bar background */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.06738 12C1.06738 5.92487 5.99225 1 12.0674 1H1189.93C1196.01 1 1200.93 5.92487 1200.93 12V51H1.06738V12Z"
            className="fill-white dark:fill-[#0a0a0a]"
          />
          
          {/* Browser Controls */}
          <circle cx="27" cy="25" r="6" className="fill-[#ff5f57]" />
          <circle cx="47" cy="25" r="6" className="fill-[#ffbd2e]" />
          <circle cx="67" cy="25" r="6" className="fill-[#28c840]" />
          
          {/* URL Input Area */}
          <path
            d="M286 17C286 13.6863 288.686 11 292 11H946C949.314 11 952 13.6863 952 17V35C952 38.3137 949.314 41 946 41H292C288.686 41 286 38.3137 286 35V17Z"
            className="fill-gray-100 dark:fill-[#1a1a1a]"
          />
          
          {/* URL Text */}
          <text
            x="580"
            y="30"
            className="fill-gray-400 dark:fill-gray-500"
            fontSize="12"
            fontFamily="monospace"
            textAnchor="middle"
          >
            {url}
          </text>
        </g>
      </svg>
    </div>
  )
}
