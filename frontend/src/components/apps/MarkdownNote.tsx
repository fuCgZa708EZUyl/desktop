import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function MarkdownNote() {
  const [markdown, setMarkdown] = useState("# 我的笔记\n\n在这里输入你的 Markdown 内容...");
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <h3 className="font-semibold text-gray-700">Markdown 笔记</h3>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
        >
          {isPreview ? "编辑" : "预览"}
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isPreview ? (
          <div className="h-full p-4 overflow-auto prose prose-sm max-w-none">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full p-4 resize-none border-none focus:outline-none font-mono text-sm"
            placeholder="在这里输入 Markdown 内容..."
          />
        )}
      </div>
    </div>
  );
}
