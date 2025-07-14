import { DockWave } from "./components/DockWave"
import WindowManager from "./components/window/WindowsManager"
import { useAppDispatch } from "./store/hooks"
import { openWindow } from "./store/windowsSlice"
import { getAllApps } from "./components/appRegistry"
import type { AppType } from "./store/windowsSlice"

function App() {
  const dispatch = useAppDispatch()

  const handleOpenApp = (appType: AppType) => {
    dispatch(openWindow(appType))
  }

  // 从应用注册表获取所有应用
  const apps = getAllApps();

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      <WindowManager />
      <DockWave
        items={apps.map(app => ({
          icon: app.icon,
          name: app.name,
          onClick: () => handleOpenApp(app.appType)
        }))}
      />
    </div>
  )
}

export default App
