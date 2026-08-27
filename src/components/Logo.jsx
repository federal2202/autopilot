// Renders just the mark + wordmark — wrap it in an element carrying the
// "navbar-logo" class (an <a> in the navbar, a <div> in the footer).
// Plain <img>, not next/image — it's an SVG, so there's no format
// conversion or responsive-size work for next/image to actually do here.
// `variant` picks the mark that reads against the surrounding section: the
// navbar sits over the cream hero (dark mark), the footer stays a
// near-black band (light mark).
export default function Logo({ size = 34, variant = "dark" }) {
  const markSrc = variant === "light" ? "/ar-mark-white.svg" : "/ar-mark-black.svg";
  return (
    <>
      <span className="navbar-logo-mark" style={{ width: size, height: size }}>
        <img src={markSrc} alt="AR Autopilot" width={size} height={size} className="navbar-logo-img" />
      </span>
      <span className="navbar-logo-word">
        <span className="navbar-logo-accent">Autopilot</span>
      </span>
    </>
  );
}
