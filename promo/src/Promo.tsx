import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const ORANGE = "#ea580c";
const INK = "#1c1917";
const CREAM = "#fff7ed";
const MUTED = "#78716c";

const fontStack =
  '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", system-ui, sans-serif';

// ---- shared bits ----------------------------------------------------------

const FadeUp: React.FC<{
  delay?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 20, stiffness: 120 } });
  return (
    <div
      style={{
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---- scenes ---------------------------------------------------------------

const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{ background: INK, justifyContent: "center", alignItems: "center", fontFamily: fontStack }}
    >
      <div style={{ fontSize: 96, fontWeight: 800, color: CREAM, letterSpacing: 4, display: "flex", gap: 24 }}>
        <FadeUp delay={5}>寫履歷，</FadeUp>
        <span
          style={{
            color: ORANGE,
            clipPath: `inset(0 ${(1 - wipe) * 100}% 0 0)`,
          }}
        >
          不用先註冊
        </span>
      </div>
    </AbsoluteFill>
  );
};

const FEATURES = ["免註冊免登入", "資料不出你的瀏覽器", "下載可編輯 .docx", "斷網也能用"];

const SceneFeatures: React.FC = () => (
  <AbsoluteFill
    style={{ background: CREAM, justifyContent: "center", alignItems: "center", fontFamily: fontStack }}
  >
    <div style={{ display: "flex", gap: 32 }}>
      {FEATURES.map((f, i) => (
        <FadeUp key={f} delay={i * 8}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: INK,
              background: "white",
              border: `3px solid ${ORANGE}`,
              borderRadius: 999,
              padding: "24px 48px",
              boxShadow: "0 8px 30px rgba(234,88,12,0.18)",
            }}
          >
            {f}
          </div>
        </FadeUp>
      ))}
    </div>
  </AbsoluteFill>
);

const SceneDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const tilt = interpolate(enter, [0, 1], [12, 0]);
  return (
    <AbsoluteFill
      style={{ background: INK, justifyContent: "center", alignItems: "center", fontFamily: fontStack, perspective: 1600, paddingBottom: 40 }}
    >
      <FadeUp delay={50} style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: CREAM, opacity: 0.9 }}>
          三分鐘，從空白到 Word 履歷
        </div>
      </FadeUp>
      <div
        style={{
          width: 1400,
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(234,88,12,0.35)",
          transform: `scale(${0.85 + enter * 0.15}) rotateX(${tilt}deg)`,
          opacity: enter,
          border: "1px solid #44403c",
        }}
      >
        {/* fake browser chrome */}
        <div style={{ height: 44, background: "#292524", display: "flex", alignItems: "center", gap: 10, padding: "0 20px" }}>
          {["#f87171", "#fbbf24", "#34d399"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <div style={{ marginLeft: 20, fontSize: 18, color: MUTED, background: "#1c1917", borderRadius: 8, padding: "4px 16px" }}>
            resumate-partner.vercel.app
          </div>
        </div>
        <OffthreadVideo src={staticFile("tour.mp4")} style={{ width: "100%", display: "block" }} muted />
      </div>
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [0, 60], [0.4, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{ background: CREAM, justifyContent: "center", alignItems: "center", fontFamily: fontStack }}
    >
      <FadeUp>
        <div style={{ fontSize: 110, fontWeight: 900, color: INK, letterSpacing: 2 }}>
          Resumate <span style={{ color: ORANGE, textShadow: `0 0 ${60 * glow}px rgba(234,88,12,0.5)` }}>Partner</span>
        </div>
      </FadeUp>
      <FadeUp delay={15}>
        <div style={{ fontSize: 40, color: MUTED, marginTop: 24, letterSpacing: 6 }}>
          你的履歷，留在你的瀏覽器
        </div>
      </FadeUp>
    </AbsoluteFill>
  );
};

// ---- composition ----------------------------------------------------------

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: fontStack }}>
    <Sequence durationInFrames={75}>
      <SceneHook />
    </Sequence>
    <Sequence from={75} durationInFrames={80}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={155} durationInFrames={215}>
      <SceneDemo />
    </Sequence>
    <Sequence from={370} durationInFrames={110}>
      <SceneOutro />
    </Sequence>
  </AbsoluteFill>
);
