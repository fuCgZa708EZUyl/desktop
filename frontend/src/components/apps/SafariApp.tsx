import { useState } from "react";

export default function SafariApp() {
  const [url, setUrl] = useState("https://www.apple.com");

  return (
    <div className="text-sm">
      <h3 className="font-bold mb-2">Safari</h3>
      <div className="bg-gray-100 p-2 rounded mb-2">
        <input 
          type="text" 
          placeholder="搜索或输入网址" 
          className="w-full p-1 text-xs border rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <div className="text-gray-600 text-center py-8">
        <div className="text-2xl mb-2">🌐</div>
        <div>正在加载 {url}</div>
      </div>
    </div>
  );
}
