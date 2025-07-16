import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [showTagline, setShowTagline] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    // Show tagline after 1 second
    const taglineTimer = setTimeout(() => {
      setShowTagline(true)
    }, 1000)

    return () => {
      clearInterval(timer)
      clearTimeout(taglineTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23F0B90B%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* GTA Style Logo */}
        <div className="mb-8 gta-slide-in">
          <h1 className="font-gta text-6xl md:text-8xl font-black gta-gradient-text mb-4 tracking-wider">
            GTA ONLINE
          </h1>
          <h2 className="font-gta text-2xl md:text-4xl font-bold text-primary mb-2 tracking-wide">
            CAR TRACKER
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto"></div>
        </div>

        {/* Tagline */}
        {showTagline && (
          <div className="mb-12 gta-slide-in" style={{ animationDelay: '0.3s' }}>
            <p className="font-gta-body text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              "You got the car, you've driven it recklessly but cannot remember where you parked it"
            </p>
          </div>
        )}

        {/* Loading Bar */}
        <div className="mb-8 gta-slide-in" style={{ animationDelay: '0.6s' }}>
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="font-gta-body text-sm text-muted-foreground">LOADING</span>
              <span className="font-gta-body text-sm text-primary font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-100 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="gta-slide-in" style={{ animationDelay: '0.9s' }}>
          <p className="font-gta-body text-sm text-muted-foreground gta-loading">
            Initializing Vehicle Database...
          </p>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}