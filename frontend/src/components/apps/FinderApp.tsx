export default function FinderApp() {
  return (
    <div className="text-sm">
      <h3 className="font-bold mb-2">Finder</h3>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span>📁</span> Documents
        </div>
        <div className="flex items-center gap-2">
          <span>📁</span> Desktop
        </div>
        <div className="flex items-center gap-2">
          <span>📁</span> Downloads
        </div>
        <div className="flex items-center gap-2">
          <span>📁</span> Applications
        </div>
        <div className="flex items-center gap-2">
          <span>📁</span> Pictures
        </div>
      </div>
    </div>
  );
}
