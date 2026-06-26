import { ImageResponse } from "next/og";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo-path";

export const size = { width: 32, height: 32 };
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
          background: "#15130F",
        }}
      >
        <svg width="26" height="26" viewBox={LOGO_VIEWBOX} fill="#E8E1D4">
          <path d={LOGO_PATH} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
