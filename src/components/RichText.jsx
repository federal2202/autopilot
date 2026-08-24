// Renders text from content.js, turning **phrase** into an accented
// <strong> so key phrases can be pulled out of long gray paragraphs.
export default function RichText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="text-emphasis">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}
