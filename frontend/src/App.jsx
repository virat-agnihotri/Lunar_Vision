import { useState, useCallback } from 'react'
import './App.css'
import Dashboard from './components/Dashboard.jsx'
import StartupAnimation from './components/StartupAnimation/StartupAnimation.jsx'
import { ANIMATION_CONFIG } from './config/animationConfig.js'

function App() {
  const [showAnimation, setShowAnimation] = useState(ANIMATION_CONFIG.enabled)

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false)
  }, [])

  return (
    <>
    {/* the below is or the start up animation currently commented snce working on backend */}
      {/* {showAnimation && (
        <StartupAnimation onComplete={handleAnimationComplete} />
      )} */}
      <Dashboard />
    </>
  )
}

export default App

