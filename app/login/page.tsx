"use client"
import Image from "next/image"
import Link from "next/link"
import { Playfair_Display } from "next/font/google"
import { cn } from "@/lib/utils"
import { signIn } from "next-auth/react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
})

export default function LoginPage() {
  return (
    <div className={cn("min-h-screen flex", playfair.variable)}>

      {/* ── LEFT PANEL ── */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white min-h-screen">
        <div className="flex flex-col flex-1 px-10 sm:px-14 pt-10">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[1.4rem] font-black text-gray-900 tracking-tight">
              Trip<span className="text-violet-600 italic">Vibee</span>
              <sup className="text-violet-400 text-xs not-italic font-bold">+</sup>
            </span>
            <svg width="44" height="20" viewBox="0 0 44 20" fill="none" aria-hidden="true">
              <circle cx="5" cy="10" r="2" fill="#7c3aed" opacity="0.35" />
              <circle cx="11" cy="7" r="1.5" fill="#7c3aed" opacity="0.25" />
              <path d="M15 10 C20 6, 27 8, 34 4" stroke="#7c3aed" strokeWidth="1.4"
                strokeDasharray="3 2" strokeLinecap="round" opacity="0.5" />
              <path d="M32 1 L37 5 L32 4.5 Z" fill="#7c3aed" opacity="0.65" />
            </svg>
          </div>

          {/* Heading */}
          <div className="mt-8 shrink-0">
            <p className="text-[2.15rem] font-extrabold text-gray-900 leading-tight tracking-tight">
              Welcome back,
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[2.15rem] font-extrabold italic text-violet-600 relative leading-tight"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Explorer!
                <svg className="absolute -bottom-0.5 left-0 w-full" height="5"
                  viewBox="0 0 180 5" fill="none" aria-hidden="true">
                  <path d="M2 3.5 C50 1, 100 4.5, 178 2.5"
                    stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-violet-400 text-xl leading-none mt-1">✦</span>
              <span className="text-violet-300 text-base leading-none mt-1">·</span>
            </div>
            <p className="mt-4 text-gray-500 text-sm leading-relaxed">
              Log in to continue your journey<br />
              and explore the world with{" "}
              <span className="text-violet-600 font-semibold">TripVibee</span>.
            </p>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => signIn("google")}
            className="mt-7 shrink-0 flex items-center justify-center gap-3 w-full border border-gray-200 rounded-full py-3.5 px-6 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="mt-5 shrink-0 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-xs font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Feature Badges */}
          <div className="mt-5 shrink-0 flex items-start justify-between gap-3">
            {/* Curated with love */}
            <div className="flex flex-col items-center text-center gap-1.5 flex-1">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#7c3aed" aria-hidden="true">
                  <path d="M12 21S3.5 15.5 3.5 9.5A5.5 5.5 0 0 1 12 5.2 5.5 5.5 0 0 1 20.5 9.5C20.5 15.5 12 21 12 21z" />
                </svg>
              </div>
              <p className="text-[11px] font-bold text-violet-600 leading-snug">Curated with love</p>
              <p className="text-[10px] text-gray-400 leading-snug">Handpicked trips just for you</p>
            </div>
            {/* Expertly planned */}
            <div className="flex flex-col items-center text-center gap-1.5 flex-1">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <p className="text-[11px] font-bold text-emerald-600 leading-snug">Expertly planned</p>
              <p className="text-[10px] text-gray-400 leading-snug">Itineraries by travel experts</p>
            </div>
            {/* Safe & secure */}
            <div className="flex flex-col items-center text-center gap-1.5 flex-1">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <rect x="9" y="11" width="6" height="5" rx="1" />
                  <path d="M10 11V9a2 2 0 1 1 4 0v2" />
                </svg>
              </div>
              <p className="text-[11px] font-bold text-amber-600 leading-snug">Safe &amp; secure</p>
              <p className="text-[10px] text-gray-400 leading-snug">Your data is always protected</p>
            </div>
          </div>

          {/* City Skyline Illustration — fills remaining vertical space */}
          <div className="mt-5 flex-1 min-h-[148px]">
            <CityIllustration />
          </div>
        </div>

        {/* Footer */}
        <p className="shrink-0 text-center text-gray-400 text-[11px] py-5 px-10">
          By continuing, you agree to our{" "}
          <Link href="#" className="text-violet-600 underline underline-offset-2 hover:text-violet-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-violet-600 underline underline-offset-2 hover:text-violet-700">
            Privacy Policy
          </Link>.
        </p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <Image src="/images/hero.png" alt="Travel inspiration" fill className="object-cover" priority />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/65" />

        {/* Dot grid — top left */}
        <div className="absolute top-8 left-8 grid grid-cols-7 gap-[13px]">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-white opacity-40" />
          ))}
        </div>

        {/* Paper plane — top right */}
        <div className="absolute top-8 right-10 text-white opacity-70">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
          </svg>
        </div>

        {/* Dashed curved path decoration */}
        <div className="absolute top-12 right-6 opacity-45">
          <svg width="72" height="64" viewBox="0 0 72 64" fill="none">
            <path d="M65 4 C55 4, 8 18, 4 60" stroke="white" strokeWidth="1.5"
              strokeDasharray="4 4" strokeLinecap="round" />
          </svg>
        </div>

        {/* Overlay text */}
        <div className="absolute top-14 inset-x-0 flex flex-col items-center px-10 text-center">
          {/* Heart doodle */}
          <svg className="absolute left-[10%] top-1 opacity-80" width="28" height="28"
            viewBox="0 0 28 28" fill="none" stroke="white" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 24S4 17.5 4 11A7 7 0 0 1 14 6.7 7 7 0 0 1 24 11C24 17.5 14 24 14 24z" />
          </svg>

          <h2
            className="text-white font-black leading-[1.1] drop-shadow-lg"
            style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
          >
            Collect moments,
          </h2>
          <div className="relative mt-1">
            <h2
              className="text-white font-black leading-[1.1] drop-shadow-lg"
              style={{ fontFamily: "var(--font-playfair), serif", fontSize: "clamp(2rem, 3.6vw, 3.2rem)" }}
            >
              Not things
            </h2>
            {/* Pink squiggle underline */}
            <svg className="absolute -bottom-2 left-0 w-full" height="9" viewBox="0 0 200 9"
              fill="none" aria-hidden="true">
              <path d="M4 6 C35 2, 75 8, 110 5 S168 2, 196 6"
                stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Social proof card */}
        <div className="absolute bottom-20 left-6 right-6">
          <div className="bg-white rounded-2xl p-4 shadow-2xl w-[270px]">
            {/* Avatars + badge */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2.5">
                {[
                  "from-rose-300 to-pink-500",
                  "from-amber-300 to-orange-500",
                  "from-teal-300 to-emerald-500",
                  "from-sky-300 to-blue-500",
                  "from-violet-300 to-purple-500",
                ].map((g, i) => (
                  <div key={i}
                    className={cn("w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br", g)} />
                ))}
              </div>
              <span className="bg-violet-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                50K+
              </span>
            </div>
            {/* Text */}
            <p className="mt-2.5 text-gray-700 text-[12px] leading-snug">
              Join{" "}
              <span className="font-bold text-gray-900">50K+ travelers</span>{" "}
              who've already found their vibe with{" "}
              <span className="text-violet-600 font-semibold">TripVibee</span>
            </p>
            {/* Destination thumbnails */}
            <div className="mt-3 flex items-center gap-2">
              {[
                "from-cyan-300 to-blue-500",
                "from-blue-500 to-indigo-800",
                "from-orange-400 to-red-600",
                "from-violet-500 to-purple-900",
              ].map((g, i) => (
                <div key={i}
                  className={cn("w-10 h-10 rounded-full border-2 border-white shadow-sm bg-gradient-to-br", g)} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom journey tagline */}
        <div className="absolute bottom-7 inset-x-0 flex items-center justify-center gap-2.5">
          <span className="text-white/80 text-[11px] font-medium tracking-wide">🗺 Plan</span>
          <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
            <path d="M1 4 L22 4" stroke="white" strokeWidth="1.3" strokeDasharray="3 2.5"
              strokeLinecap="round" opacity="0.65" />
            <path d="M20 2 L24 4 L20 6" stroke="white" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
          </svg>
          <span className="text-white/80 text-[11px] font-medium tracking-wide">🪧 Explore</span>
          <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
            <path d="M1 4 L22 4" stroke="white" strokeWidth="1.3" strokeDasharray="3 2.5"
              strokeLinecap="round" opacity="0.65" />
            <path d="M20 2 L24 4 L20 6" stroke="white" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round" opacity="0.65" />
          </svg>
          <span className="text-white/80 text-[11px] font-medium tracking-wide">Vibee ♡</span>
        </div>
      </div>
    </div>
  )
}

/* ── City Skyline Illustration ── */
function CityIllustration() {
  const c = "#8b5cf6"
  const sw = "1.5"

  return (
    <svg
      viewBox="0 0 560 192"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Background */}
      <rect width="560" height="192" rx="14" fill="#f5f3ff" />
      {/* Ground line */}
      <line x1="0" y1="182" x2="560" y2="182" stroke="#ddd6fe" strokeWidth="0.8" />

      {/* ── DECORATIVE DOTS ── */}
      {[
        [38,30],[50,20],[62,32],[74,22],[86,32],
        [38,46],[50,36],[62,48],[74,38],[86,48],
        [440,22],[452,14],[464,24],[476,14],[488,24],
        [440,38],[452,30],[464,40],[476,30],[488,40],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.8" fill={c} opacity="0.18" />
      ))}

      {/* ── SMALL CHAPEL (x:8–44) ── */}
      <path d="M8,182 L8,140 L44,140 L44,182" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      <path d="M8,140 L26,115 L44,140" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      {/* Cross */}
      <line x1="26" y1="115" x2="26" y2="104" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="21" y1="109" x2="31" y2="109" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      {/* Door */}
      <path d="M18,182 L18,161 Q18,155 26,155 Q34,155 34,161 L34,182" stroke={c} strokeWidth="1.2" />

      {/* ── COLOSSEUM (x:50–168) ── */}
      {/* Outer walls */}
      <path d="M50,182 L50,142 L168,142 L168,182" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      {/* Level dividers */}
      <line x1="50" y1="162" x2="168" y2="162" stroke={c} strokeWidth="1.2" />
      <line x1="54" y1="150" x2="164" y2="150" stroke={c} strokeWidth="1.1" />
      {/* Bottom arches — 7 arches */}
      {[56, 72, 88, 104, 120, 136, 152].map((x, i) => (
        <path key={`ba${i}`}
          d={`M${x},182 L${x},165 Q${x},162 ${x + 6},162 Q${x + 12},162 ${x + 12},165 L${x + 12},182`}
          stroke={c} strokeWidth="1.1" />
      ))}
      {/* Middle arches — 7 arches */}
      {[56, 72, 88, 104, 120, 136, 152].map((x, i) => (
        <path key={`ma${i}`}
          d={`M${x},162 L${x},153 Q${x},150 ${x + 5},150 Q${x + 10},150 ${x + 10},153 L${x + 10},162`}
          stroke={c} strokeWidth="1" />
      ))}
      {/* Top arches — 5 arches */}
      {[62, 82, 102, 122, 142].map((x, i) => (
        <path key={`ta${i}`}
          d={`M${x},150 L${x},145 Q${x},142 ${x + 5},142 Q${x + 10},142 ${x + 10},145 L${x + 10},150`}
          stroke={c} strokeWidth="0.9" />
      ))}

      {/* ── EIFFEL TOWER (center x=210, base y=182) ── */}
      {/* Left outer leg */}
      <path d="M180,182 L192,160 L196,145 L204,90 L210,22"
        stroke={c} strokeWidth={sw} strokeLinecap="round" />
      {/* Right outer leg */}
      <path d="M240,182 L228,160 L224,145 L216,90 L210,22"
        stroke={c} strokeWidth={sw} strokeLinecap="round" />
      {/* Inner arch left leg */}
      <path d="M191,182 L195,160" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      {/* Inner arch right leg */}
      <path d="M229,182 L225,160" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      {/* Horizontal floors */}
      <line x1="180" y1="173" x2="240" y2="173" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      <line x1="192" y1="160" x2="228" y2="160" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
      <line x1="196" y1="145" x2="224" y2="145" stroke={c} strokeWidth="1.2" strokeLinecap="round" />
      <line x1="200" y1="126" x2="220" y2="126" stroke={c} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="203" y1="108" x2="217" y2="108" stroke={c} strokeWidth="1.1" strokeLinecap="round" />
      <line x1="205" y1="90" x2="215" y2="90" stroke={c} strokeWidth="1" strokeLinecap="round" />
      <line x1="207" y1="72" x2="213" y2="72" stroke={c} strokeWidth="1" strokeLinecap="round" />
      <line x1="208" y1="55" x2="212" y2="55" stroke={c} strokeWidth="0.9" strokeLinecap="round" />
      {/* Antenna */}
      <line x1="210" y1="22" x2="210" y2="7" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      {/* Cross bracing in arch */}
      <path d="M192,160 L196,182" stroke={c} strokeWidth="0.8" opacity="0.45" />
      <path d="M228,160 L224,182" stroke={c} strokeWidth="0.8" opacity="0.45" />

      {/* ── DOMED BUILDING (center x=305, base y=182) ── */}
      {/* Main body */}
      <path d="M262,182 L262,150 L348,150 L348,182" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      {/* Drum */}
      <path d="M278,150 L278,136 L332,136 L332,150"
        stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
      {/* Dome */}
      <path d="M278,136 Q278,94 305,86 Q332,94 332,136"
        stroke={c} strokeWidth={sw} strokeLinecap="round" />
      {/* Cross finial */}
      <line x1="305" y1="86" x2="305" y2="72" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="299" y1="78" x2="311" y2="78" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      {/* Columns */}
      {[272, 284, 296, 308, 320, 334].map((x, i) => (
        <line key={`col${i}`} x1={x} y1="150" x2={x} y2="182" stroke={c} strokeWidth="1.2" />
      ))}
      {/* Door arch */}
      <path d="M288,182 L288,166 Q288,160 305,160 Q322,160 322,166 L322,182"
        stroke={c} strokeWidth="1.2" />

      {/* ── LEANING TOWER OF PISA (center x=382, base y=182) ── */}
      <g transform="rotate(4, 382, 182)">
        {/* Body */}
        <path d="M363,182 L363,70 Q363,58 382,58 Q401,58 401,70 L401,182"
          stroke={c} strokeWidth={sw} />
        {/* Belfry */}
        <path d="M368,58 Q368,43 382,40 Q396,43 396,58"
          stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="368" y1="58" x2="396" y2="58" stroke={c} strokeWidth="1.4" />
        <line x1="374" y1="40" x2="390" y2="40" stroke={c} strokeWidth="1.2" />
        {/* Floor bands */}
        {[100, 116, 132, 148, 164, 176].map((y, i) => (
          <line key={`pf${i}`} x1="363" y1={y} x2="401" y2={y} stroke={c} strokeWidth="1.1" />
        ))}
        {/* Arch windows on floors */}
        <path d="M367,100 L367,87 Q367,83 372,83 Q377,83 377,87 L377,100"
          stroke={c} strokeWidth="0.9" />
        <path d="M387,100 L387,87 Q387,83 392,83 Q397,83 397,87 L397,100"
          stroke={c} strokeWidth="0.9" />
        <path d="M367,116 L367,103 Q367,100 372,100 Q377,100 377,103 L377,116"
          stroke={c} strokeWidth="0.9" />
        <path d="M387,116 L387,103 Q387,100 392,100 Q397,100 397,103 L397,116"
          stroke={c} strokeWidth="0.9" />
      </g>

      {/* ── MINARET / TOWER (center x=426, base y=182) ── */}
      {/* Body */}
      <path d="M413,182 L413,98 Q413,88 426,88 Q439,88 439,98 L439,182"
        stroke={c} strokeWidth={sw} />
      {/* Onion dome */}
      <path d="M416,88 Q416,68 426,62 Q436,68 436,88"
        stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      {/* Spire */}
      <line x1="426" y1="62" x2="426" y2="49" stroke={c} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="426" cy="47" r="3.5" stroke={c} strokeWidth="1.2" />
      {/* Window bands */}
      {[125, 144, 162, 175].map((y, i) => (
        <line key={`mw${i}`} x1="415" y1={y} x2="437" y2={y} stroke={c} strokeWidth="1.1" />
      ))}
      {/* Arch window */}
      <path d="M417,125 L417,110 Q417,106 426,106 Q435,106 435,110 L435,125"
        stroke={c} strokeWidth="1.1" />

      {/* ── HOT AIR BALLOON (center x=490, y=50) ── */}
      {/* Balloon */}
      <ellipse cx="490" cy="50" rx="28" ry="34" stroke={c} strokeWidth={sw} />
      {/* Vertical seams */}
      <path d="M490,16 L490,84" stroke={c} strokeWidth="0.9" opacity="0.38" />
      <path d="M477,19 C474,50 474,50 477,84" stroke={c} strokeWidth="0.9" opacity="0.38" />
      <path d="M503,19 C506,50 506,50 503,84" stroke={c} strokeWidth="0.9" opacity="0.38" />
      {/* Equator band */}
      <path d="M462,50 Q490,55 518,50" stroke={c} strokeWidth="0.9" opacity="0.4" />
      {/* Ropes */}
      <line x1="474" y1="84" x2="478" y2="98" stroke={c} strokeWidth="1.1" />
      <line x1="506" y1="84" x2="502" y2="98" stroke={c} strokeWidth="1.1" />
      <line x1="483" y1="84" x2="483" y2="99" stroke={c} strokeWidth="1.1" />
      <line x1="497" y1="84" x2="497" y2="99" stroke={c} strokeWidth="1.1" />
      {/* Basket */}
      <path d="M476,99 L476,111 Q476,114 490,114 Q504,114 504,111 L504,99 Z"
        stroke={c} strokeWidth={sw} strokeLinejoin="round" />

      {/* ── SMALL AIRPLANE (x:522–554, y:16–30) ── */}
      {/* Fuselage */}
      <path d="M522,24 L554,18 L547,24 L554,30 Z"
        stroke={c} strokeWidth="1.2" fill="#f5f3ff" />
      {/* Wing */}
      <path d="M537,21 L541,13 L545,21" stroke={c} strokeWidth="1.1" fill="#f5f3ff" />
      {/* Tail fin */}
      <path d="M524,24 L521,20 L527,23" stroke={c} strokeWidth="1" fill="#f5f3ff" />
    </svg>
  )
}

/* ── Google Icon ── */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
