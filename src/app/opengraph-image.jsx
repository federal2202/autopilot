import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f5f2f3",
          color: "#1f1f1f",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#0f0f0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f5f2f3",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            AR
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 1 }}>{site.name}</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 56, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>
          Full-Stack Media & Automation Studio
        </div>
        <div style={{ marginTop: 28, fontSize: 28, color: "#5a5a5a", maxWidth: 900 }}>
          Ty zajmujesz się biznesem. My robimy resztę na autopilocie.
        </div>
        <div style={{ marginTop: 56, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 8, background: "#eb381c", borderRadius: 4 }} />
          <div style={{ fontSize: 22, color: "#5a5a5a" }}>ar-autopilot.pl</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
