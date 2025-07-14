
import { useAppSelector } from "../../store/hooks";
import { windowSelectors } from "../../store/windowsSlice";
import Window from "./Window";

export default function WindowManager() {
  const windows = useAppSelector(windowSelectors.allWindows);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {windows.map(win => (
        <Window key={win.id} window={win} />
      ))}
    </div>
  );
}