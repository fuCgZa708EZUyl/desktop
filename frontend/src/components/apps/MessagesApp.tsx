import { useState } from "react";

export default function MessagesApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { text: "你好！", sender: "me", time: "10:30" },
    { text: "嗨，最近怎么样？", sender: "other", time: "10:31" },
    { text: "很好，你呢？", sender: "me", time: "10:32" },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { 
        text: message, 
        sender: "me", 
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }]);
      setMessage("");
    }
  };

  return (
    <div className="text-sm h-full flex flex-col">
      <h3 className="font-bold mb-2">信息</h3>
      <div className="flex-1 space-y-2 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded-lg ${
              msg.sender === 'me' 
                ? 'bg-blue-500 text-white rounded-br-sm' 
                : 'bg-gray-200 rounded-bl-sm'
            }`}>
              <div>{msg.text}</div>
              <div className={`text-xs ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="输入消息..." 
          className="flex-1 p-1 text-xs border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
        >
          发送
        </button>
      </div>
    </div>
  );
}
