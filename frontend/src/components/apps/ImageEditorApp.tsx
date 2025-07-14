import { useState } from "react";

export default function ImageEditorApp() {
  const [selectedTool, setSelectedTool] = useState('brush');
  const [brushSize, setBrushSize] = useState(5);

  const tools = [
    { id: 'brush', name: '画笔', icon: '🖌️' },
    { id: 'eraser', name: '橡皮擦', icon: '🧽' },
    { id: 'text', name: '文字', icon: '📝' },
    { id: 'crop', name: '裁剪', icon: '✂️' },
  ];

  return (
    <div className="text-sm">
      <h3 className="font-bold mb-2">图片编辑器</h3>
      
      {/* 工具栏 */}
      <div className="mb-3 p-2 bg-gray-100 rounded">
        <div className="flex gap-2 mb-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`px-2 py-1 rounded text-xs ${
                selectedTool === tool.id ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
              title={tool.name}
            >
              {tool.icon}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">大小:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs w-6">{brushSize}</span>
        </div>
      </div>

      {/* 画布区域 */}
      <div className="bg-white border-2 border-dashed border-gray-300 p-8 text-center rounded">
        <div className="text-gray-400">
          拖拽图片到这里开始编辑
        </div>
        <div className="mt-4">
          <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">
            选择图片
          </button>
        </div>
      </div>
    </div>
  );
}
