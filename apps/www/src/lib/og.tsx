import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const paper = "#fdfdfc";
const ink = "#1d1c1a";
const soft = "#4a4844";
const muted = "#75726c";
const rule = "#e6e4df";

/** Fetches a TrueType cut of Newsreader limited to the glyphs we render. */
async function loadNewsreader(text: string, weight: 400 | 500, italic = false) {
  try {
    const family = italic ? `Newsreader:ital,wght@1,${weight}` : `Newsreader:wght@${weight}`;
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];

    if (!url) {
      return null;
    }

    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

type OgCardOptions = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footer?: string;
};

export async function renderOgCard({ eyebrow, title, subtitle, footer }: OgCardOptions) {
  const clippedTitle = title.length > 90 ? `${title.slice(0, 87)}…` : title;
  const clippedSubtitle =
    subtitle && subtitle.length > 140 ? `${subtitle.slice(0, 137)}…` : subtitle;

  const [regular, italic] = await Promise.all([
    loadNewsreader(`${clippedTitle}${eyebrow}${footer ?? ""}booom.dev`, 500),
    clippedSubtitle ? loadNewsreader(clippedSubtitle, 400, true) : Promise.resolve(null),
  ]);

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 500; style: "normal" | "italic" }[] =
    [];
  const serif = regular ? "Newsreader" : "serif";

  if (regular) {
    fonts.push({ name: "Newsreader", data: regular, weight: 500, style: "normal" });
  }

  if (italic) {
    fonts.push({ name: "Newsreader Italic", data: italic, weight: 400, style: "italic" });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: paper,
          padding: "72px 88px",
          fontFamily: serif,
          fontWeight: 500,
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: muted }}>{eyebrow}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: clippedTitle.length > 48 ? 68 : 84,
              lineHeight: 1.08,
              color: ink,
              letterSpacing: "-0.015em",
            }}
          >
            {clippedTitle}
          </div>
          {clippedSubtitle ? (
            <div
              style={{
                marginTop: 28,
                fontSize: 34,
                lineHeight: 1.35,
                color: soft,
                fontStyle: "italic",
                fontWeight: 400,
                fontFamily: italic ? "Newsreader Italic" : serif,
              }}
            >
              {clippedSubtitle}
            </div>
          ) : null}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: `2px solid ${rule}`,
            paddingTop: 24,
            fontSize: 26,
            color: muted,
          }}
        >
          <span>{footer ?? ""}</span>
          <span>booom.dev</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: fonts.length ? fonts : undefined },
  );
}
