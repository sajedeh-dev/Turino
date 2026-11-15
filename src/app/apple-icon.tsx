import { ImageResponse } from "next/og";

// Home-screen icon for iOS. iOS rounds the corners itself, so the square stays full bleed.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0F766E",
      }}
    >
      <svg width="116" height="116" viewBox="0 0 24 24" style={{ marginTop: 6, marginRight: 6 }}>
        <path
          d="M22 2 15 22 11 13 2 9Z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M22 2 11 13"
          fill="none"
          stroke="#0F766E"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>,
    size,
  );
}
