import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard.jsx'
import StartupAnimation from './components/StartupAnimation/StartupAnimation.jsx'
import { ANIMATION_CONFIG } from './config/animationConfig.js'

function App() {
  const [showAnimation, setShowAnimation] = useState(ANIMATION_CONFIG.enabled)

  return (
    <>
      {showAnimation && (
        <StartupAnimation onComplete={() => setShowAnimation(false)} />
      )}
      <Dashboard />
    </>
  )
}

export default App

