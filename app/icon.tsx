import { ImageResponse } from "next/og";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e1c",
          position: "relative",
        }}
      >
        {/* Diéresis dorada: sello de marca RÖA */}
        <div style={{ display: "flex", gap: 24, position: "absolute", top: 58 }}>
          <div style={{ width: 20, height: 20, borderRadius: 20, background: "#b08a5a" }} />
          <div style={{ width: 20, height: 20, borderRadius: 20, background: "#b08a5a" }} />
        </div>
        <div style={{ fontSize: 170, fontWeight: 400, color: "#f6f1eb", marginTop: 30 }}>O</div>
      </div>
    ),
    { ...size },
  );
}
