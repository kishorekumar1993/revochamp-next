// components/blog/FeatureBox.tsx
"use client";

import { ReactNode } from "react";

interface FeatureBoxProps {
  text?: string;
  title?: string;
  icon?: ReactNode;
}

export function FeatureBox({ text, title, icon }: FeatureBoxProps) {
  if (!text || typeof text !== "string") return null;

  const lines = text.split("\n");
  let extractedTitle: string | null = null;
  let content = text;

  const firstLine = lines[0]?.trim();
  if (firstLine?.startsWith("**") && firstLine?.includes("**")) {
    extractedTitle = firstLine.replace(/\*\*/g, "").replace(/:$/, "").trim();
    content = lines.slice(1).join("\n").trim();
  }

  const displayTitle = title ?? extractedTitle;

  return (
    <div className="my-8">
      {/* Optional header – no card, just inline with content flow */}
      {(displayTitle || icon) && (
        <div className="mb-4 flex items-center gap-2">
          {icon && <span className="text-[#C8401E]">{icon}</span>}
          {displayTitle && (
            <h3 className="font-serif font-bold text-[#C8401E] text-2xl tracking-tight">
              {displayTitle}
            </h3>
          )}
        </div>
      )}

      {/* Content – plain, no wrapping card */}
      <StaticContentParser content={content} />
    </div>
  );
}

// Clean parser – handles inline bold, bullets, headings, and spacing
function StaticContentParser({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];

  const processInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-[#C8401E]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      if (
        elements.length &&
        elements[elements.length - 1] !== <div className="h-2" />
      ) {
        elements.push(<div key={`space-${i}`} className="h-3" />);
      }
      continue;
    }

    // Bullet points (starts with '- ' or '• ')
    if (line.startsWith("- ") || line.startsWith("• ")) {
      const bulletContent = line.startsWith("- ")
        ? line.slice(2)
        : line.slice(2);
      elements.push(
        <div key={`bullet-${i}`} className="flex gap-2 items-start py-0.5 ml-2">
          <span className="text-[#C8401E] select-none">•</span>
          <span className="flex-1 text-[#3A3732] text-base leading-relaxed">
            {processInlineText(bulletContent)}
          </span>
        </div>,
      );
      continue;
    }

    // Subheading like **DeHaat (₹3,000+ Crore valuation)** — description
    const subheadingMatch = line.match(/^\*\*(.+?)\*\*/);
    if (subheadingMatch) {
      const boldText = subheadingMatch[1];
      const restText = line.slice(subheadingMatch[0].length);
      elements.push(
        <div key={`subhead-${i}`} className="mt-4 mb-1">
          <span className="font-bold text-[#2C2A27] text-base border-l-2 border-[#C8401E] pl-2">
            {boldText}
          </span>
          {restText && (
            <span className="text-base text-[#3A3732] leading-relaxed ml-1">
              {processInlineText(restText)}
            </span>
          )}
        </div>,
      );
      continue;
    }

    // Section heading (ends with colon, short line, not a bullet)
    if (
      line.includes(":") &&
      !line.startsWith("-") &&
      line.length < 60 &&
      !line.includes("**")
    ) {
      elements.push(
        <h4
          key={`heading-${i}`}
          className="font-semibold text-[#2C2A27] text-base mt-5 mb-2 flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 bg-[#C8401E] rounded-full"></span>
          <span className="tracking-wide">{processInlineText(line)}</span>
        </h4>,
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={`text-${i}`}
        className="text-base text-[#3A3732] py-0.5 leading-relaxed"
      >
        {processInlineText(line)}
      </p>,
    );
  }

  return <div className="space-y-1">{elements}</div>;
}
