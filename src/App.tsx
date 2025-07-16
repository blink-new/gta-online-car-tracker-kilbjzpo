import { useState } from 'react'
import { LoadingScreen } from '@/components/LoadingScreen'
import { Dashboard } from '@/components/Dashboard'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadingComplete} />
      ) : (
        <Dashboard />
      )}
    </div>
  )
}

export default App