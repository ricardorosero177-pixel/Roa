import { ImageResponse } from "next/og";

export const alt = "RÖA — Decoración minimalista para tu hogar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#f6f1eb",
          color: "#1e1e1c",
        }}
      >
        <div style={{ fontSize: 140, letterSpacing: -2 }}>RÖA</div>
        <div style={{ fontSize: 40, color: "#b08a5a", marginTop: 8 }}>Home &amp; Style</div>
        <div style={{ fontSize: 30, color: "#4a4a46", marginTop: 24 }}>
          Pequeños detalles que transforman tu espacio
        </div>
      </div>
    ),
    { ...size },
  );
}
