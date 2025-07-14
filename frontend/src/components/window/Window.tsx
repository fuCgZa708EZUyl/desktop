import { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import gsap from "gsap";
import { useAppDispatch } from "../../store/hooks";
import { closeWindow, focusWindow, moveWindow, resizeWindow } from "../../store/windowsSlice";
import { getAppConfig } from "../appRegistry";
import type { WindowState } from "../../store/windowsSlice";

interface WindowProps {
  window: WindowState;
}

export default function Window({ window }: WindowProps) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, []);

  const handleFocus = () => dispatch(focusWindow(window.id));
  const handleClose = () => dispatch(closeWindow(window.id));

  // 获取应用配置和组件
  const appConfig = getAppConfig(window.app);
  const AppComponent = appConfig.component;

  return (
    <Rnd
      size={{ width: window.size.width, height: window.size.height }}
      position={{ x: window.position.x, y: window.position.y }}
      onDragStop={(_, d) => {
        dispatch(moveWindow({ id: window.id, position: { x: d.x, y: d.y } }));
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        dispatch(
          resizeWindow({
            id: window.id,
            size: {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            },
          })
        );
        dispatch(
          moveWindow({ id: window.id, position: { x: position.x, y: position.y } })
        );
      }}
      bounds="parent"
      style={{ zIndex: window.zIndex }}
      onMouseDown={handleFocus}
      className="absolute"
      dragHandleClassName="window-drag-handle"
      disableDragging={false}
    >
      <div
        ref={ref}
        className="bg-white shadow-xl rounded border overflow-hidden h-full flex flex-col"
      >
        <div className="flex items-center justify-between bg-gray-100 p-2 flex-shrink-0 window-drag-handle cursor-move">
          <div className="text-sm font-bold">{window.app}</div>
          <button
            onClick={handleClose}
            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <AppComponent />
        </div>
      </div>
    </Rnd>
  );
}
