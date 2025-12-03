import './App.css'
import PreviewPanel from './components/PreviewPanel'
import EditPanel from './components/EditPanel'

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950">
      {/* Left: Preview Panel */}
      <div className="flex-1 border-r border-gray-700">
        <PreviewPanel />
      </div>
      
      {/* Right: Edit Panel */}
      <div className="w-[30%]">
        <EditPanel />
      </div>
    </div>
  )
}

export default App

