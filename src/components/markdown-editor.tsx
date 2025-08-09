"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "@/components/theme-provider";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-2 min-h-[300px]">
      <div className="relative">
        <CodeMirror
          value={value}
          onChange={onChange}
          extensions={[markdown()]}
          theme={theme}
          height="300px"
          className="h-full border rounded-md"
        />
      </div>
      <div className="prose dark:prose-invert prose-sm p-4 border rounded-md overflow-y-auto h-[300px] bg-muted/50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
      </div>
    </div>
  );
}
