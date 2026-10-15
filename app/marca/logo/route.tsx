import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DORADO = "#b08a5a";
const TINTA = "#1e1e1c";
const ARENA = "#f6f1eb";

const FRAUNCES_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/fraunces@5.0.20/files/fraunces-latin-600-normal.woff";
const POPPINS_URL =
  "https://cdn.jsdelivr.net/npm/@fontsource/poppins@5.0.14/files/poppins-latin-500-normal.woff";

let fontsCache: { fraunces: ArrayBuffer; poppins: ArrayBuffer } | null = null;
async function getFonts() {
  if (fontsCache) return fontsCache;
  const [fraunces, poppins] = await Promise.all([
    fetch(FRAUNCES_URL).then((r) => r.arrayBuffer()),
    fetch(POPPINS_URL).then((r) => r.arrayBuffer()),
  ]);
  fontsCache = { fraunces, poppins };
  return fontsCache;
}

type Variant = {
  w: number;
  h: number;
  bg: string;
  color: string;
  word: number;
};

const VARIANTS: Record<string, Variant> = {
  "perfil-beige": { w: 1080, h: 1080, bg: ARENA, color: TINTA, word: 300 },
  "perfil-oscuro": { w: 1080, h: 1080, bg: TINTA, color: ARENA, word: 300 },
  horizontal: { w: 1600, h: 640, bg: "transparent", color: TINTA, word: 240 },
  "horizontal-claro": { w: 1600, h: 640, bg: "transparent", color: ARENA, word: 240 },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const v = VARIANTS[searchParams.get("v") ?? "perfil-beige"] ?? VARIANTS["perfil-beige"];
  const { fraunces, poppins } = await getFonts();

  const W = v.word;
  const dot = W * 0.1;
  const letter = { display: "flex" } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: v.bg,
          color: v.color,
        }}
      >
        {/* Wordmark RÖA con la diéresis dorada anclada sobre la O */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            fontFamily: "Fraunces",
            fontSize: W,
            fontWeight: 600,
            lineHeight: 1,
            gap: W * 0.1,
          }}
        >
          <div style={letter}>R</div>
          <div style={{ display: "flex", position: "relative" }}>
            <div style={letter}>O</div>
            <div
              style={{
                position: "absolute",
                top: -W * 0.17,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                gap: W * 0.1,
              }}
            >
              <div style={{ width: dot, height: dot, borderRadius: 999, background: DORADO }} />
              <div style={{ width: dot, height: dot, borderRadius: 999, background: DORADO }} />
            </div>
          </div>
          <div style={letter}>A</div>
        </div>

        {/* HOME & STYLE */}
        <div
          style={{
            display: "flex",
            marginTop: W * 0.16,
            fontFamily: "Poppins",
            fontSize: W * 0.11,
            letterSpacing: W * 0.05,
            color: DORADO,
          }}
        >
          HOME &amp; STYLE
        </div>
      </div>
    ),
    {
      width: v.w,
      height: v.h,
      fonts: [
        { name: "Fraunces", data: fraunces, weight: 600, style: "normal" },
        { name: "Poppins", data: poppins, weight: 500, style: "normal" },
      ],
    },
  );
}
