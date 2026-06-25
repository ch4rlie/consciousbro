import { ImageResponse } from "next/og";
import { siteConfig } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = siteConfig.name;

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#15130F",
          color: "#E8E1D4",
          fontFamily: "serif",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 64, lineHeight: 1.1 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 30, color: "#C8651B", marginTop: 24 }}>
          You were never meant to carry it alone.
        </div>
      </div>
    ),
    { ...size }
  );
}
