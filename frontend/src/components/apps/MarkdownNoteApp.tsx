import { useState } from "react";

export default function MarkdownNoteApp() {
  const [content, setContent] = useState(`# 我的笔记

## 今日待办
- [ ] 完成项目文档
- [ ] 回复邮件
- [x] 晨会

## 灵感记录
> 好的想法需要及时记录

**重要提醒：** 记得备份文件！

\`\`\`javascript
// 代码片段
console.log('Hello, World!');
\`\`\`
`);

  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="text-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Markdown 笔记</h3>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >
          {isPreview ? '编辑' : '预览'}
        </button>
      </div>
      
      {isPreview ? (
        <div className="flex-1 bg-white border rounded p-2 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {/* 简单的 Markdown 渲染 */}
            <div dangerouslySetInnerHTML={{
              __html: content
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/- \[ \] (.*$)/gm, '<input type="checkbox" disabled> $1<br>')
                .replace(/- \[x\] (.*$)/gm, '<input type="checkbox" checked disabled> $1<br>')
                .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
                .replace(/\n/g, '<br>')
            }} />
          </div>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 border rounded p-2 text-xs font-mono resize-none"
          placeholder="开始写你的 Markdown 笔记..."
        />
      )}
    </div>
  );
}
