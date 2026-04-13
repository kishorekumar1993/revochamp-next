"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

interface CodeEditorProps {
  code: string;
  language?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  fileName?: string;
  onCodeChange?: (code: string) => void;
}

export default function CodeEditor({
  code,
  language = "javascript",
  readOnly = true,
  showLineNumbers = true,
  fileName,
  onCodeChange,
}: CodeEditorProps) {
  const [value, setValue] = useState(code);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState(1);
  const editorRef = useRef<HTMLDivElement>(null);

  // Update line count when code changes
  useEffect(() => {
    setLineCount(value.split("\n").length);
  }, [value]);

  const handleCodeChange = (newCode: string) => {
    setValue(newCode);
    onCodeChange?.(newCode);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Get language display name
  const getLanguageDisplay = (lang: string) => {
    const map: Record<string, string> = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      python: "Python",
      jsx: "React JSX",
      tsx: "React TSX",
      json: "JSON",
      css: "CSS",
      html: "HTML",
      markup: "HTML",
    };
    return map[lang] || lang.toUpperCase();
  };

  return (
    <div className="relative my-6 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2.5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          {fileName ? (
            <span className="text-sm font-medium text-gray-300">{fileName}</span>
          ) : (
            <span className="text-xs font-medium px-2.5 py-1 bg-gray-800 text-gray-300 rounded-md">
              {getLanguageDisplay(language)}
            </span>
          )}
          {readOnly && (
            <span className="text-[10px] font-medium px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">
              Read-only
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Editor with line numbers */}
      <div className="flex bg-[#1e1e2f]">
        {showLineNumbers && (
          <div className="py-4 pl-4 pr-2 text-right select-none bg-[#1e1e2f] border-r border-gray-700/50">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i + 1} className="text-xs text-gray-500 font-mono leading-6">
                {i + 1}
              </div>
            ))}
          </div>
        )}
        <div ref={editorRef} className="flex-1 overflow-auto">
          <Editor
            value={value}
            onValueChange={handleCodeChange}
            highlight={(code) => highlight(code, languages[language] || languages.javascript, language)}
            padding={16}
            style={{
              fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
              fontSize: 14,
              backgroundColor: "#1e1e2f",
              color: "#e2e8f0",
              minHeight: "100%",
            }}
            readOnly={readOnly}
            className="focus:outline-none"
            textareaClassName="focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

// "use client";
// import Editor from "react-simple-code-editor";
// import { highlight, languages } from "prismjs";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-typescript";
// import "prismjs/components/prism-python";
// // Import CSS globally (e.g., in app/globals.css) to avoid type error
// import { useState } from "react";

// interface CodeEditorProps {
//   code: string;
//   language?: string;
//   readOnly?: boolean;
// }

// export default function CodeEditor({
//   code,
//   language = "javascript",
//   readOnly = true,
// }: CodeEditorProps) {
//   const [value, setValue] = useState(code);
//   const [copied, setCopied] = useState(false);

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(value);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="relative my-4 border border-gray-700 rounded-xl overflow-hidden">
//       <div className="flex justify-between items-center bg-gray-900 px-4 py-2 border-b border-gray-700">
//         <span className="text-xs text-gray-400">{language}</span>
//         <button
//           onClick={copyToClipboard}
//           className="text-xs bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded"
//         >
//           {copied ? "Copied!" : "Copy"}
//         </button>
//       </div>
//       <Editor
//         value={value}
//         onValueChange={setValue}
//         highlight={(code: string) => highlight(code, languages[language], language)}
//         padding={16}
//         style={{
//           fontFamily: '"Fira Code", monospace',
//           fontSize: 14,
//           backgroundColor: "#1e1e2f",
//           color: "#fff",
//         }}
//         readOnly={readOnly}
//         className="overflow-auto"
//       />
//     </div>
//   );
// }