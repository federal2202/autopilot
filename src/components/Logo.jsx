// Renders just the mark + wordmark — wrap it in an element carrying the
// "navbar-logo" class (an <a> in the navbar, a <div> in the footer).
// Plain <img>, not next/image — it's an SVG, so there's no format
// conversion or responsive-size work for next/image to actually do here.
export default function Logo({ size = 34 }) {
  return (
    <>
      <span className="navbar-logo-mark" style={{ width: size, height: size }}>
        <img src="/ar-mark-white.svg" alt="AR Autopilot" width={size} height={size} className="navbar-logo-img" />
      </span>
      <span className="navbar-logo-word">
        <span className="navbar-logo-accent">Autopilot</span>
      </span>
    </>
  );
}
