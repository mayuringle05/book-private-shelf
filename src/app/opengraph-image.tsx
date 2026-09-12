import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "BOOK — The Private Shelf";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#090807",
          backgroundImage:
            "radial-gradient(80% 60% at 82% 10%, rgba(201,135,98,0.22) 0%, rgba(201,135,98,0) 60%), radial-gradient(60% 50% at 10% 95%, rgba(104,47,45,0.35) 0%, rgba(104,47,45,0) 60%)",
          color: "#F3EDE3",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 30, letterSpacing: 14, color: "#C98762" }}>BOOK</div>
            <div style={{ fontSize: 17, letterSpacing: 6, color: "rgba(243,237,227,0.5)", marginTop: 8 }}>
              THE PRIVATE SHELF
            </div>
          </div>
          <div style={{ fontSize: 17, letterSpacing: 6, color: "rgba(243,237,227,0.42)" }}>A LIBRARY, NOT A FEED</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.04,
              letterSpacing: -1,
              color: "#C98762",
              display: "flex",
              flexDirection: "column",
            }}
          >
            Attraction is a language.
          </div>
          <div style={{ fontSize: 44, color: "rgba(243,237,227,0.86)", marginTop: 20 }}>Learn how to read it.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: 18, letterSpacing: 4, color: "rgba(243,237,227,0.45)" }}>
            ORIGINAL BOOKS · READ SLOWLY
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 220, height: 1, backgroundColor: "rgba(201,135,98,0.6)" }} />
            <div style={{ fontSize: 17, letterSpacing: 4, color: "rgba(243,237,227,0.45)" }}>EST. SHELF OF ONE</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}