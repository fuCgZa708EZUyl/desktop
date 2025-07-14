import { useState } from "react";

export default function FaceTimeApp() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const startCall = () => {
    setIsCallActive(true);
    // 模拟通话时长计时
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    // 30秒后自动结束通话（演示用）
    setTimeout(() => {
      setIsCallActive(false);
      setCallDuration(0);
      clearInterval(interval);
    }, 30000);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-sm">
      <h3 className="font-bold mb-2">FaceTime</h3>
      <div className={`p-4 rounded text-center ${isCallActive ? 'bg-green-100' : 'bg-black text-white'}`}>
        <div className="text-lg">📹</div>
        {isCallActive ? (
          <>
            <div className="mt-2 text-green-800">通话中...</div>
            <div className="text-sm text-green-600">{formatTime(callDuration)}</div>
            <button 
              onClick={endCall}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
            >
              结束通话
            </button>
          </>
        ) : (
          <>
            <div className="mt-2">准备开始视频通话</div>
            <button 
              onClick={startCall}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
            >
              开始通话
            </button>
          </>
        )}
      </div>
    </div>
  );
}
