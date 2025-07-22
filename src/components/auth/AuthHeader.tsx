import { Button } from '@/components/ui/button'
import { LogOut, User, Sparkles, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useState, useRef, useEffect } from 'react'

export function AuthHeader() {
  const { user, signOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setIsDropdownOpen(false)
  }

  const getInitials = (email: string | undefined) => {
    if (!email) return 'U'
    return email.split('@')[0].slice(0, 2).toUpperCase()
  }

  if (!user) return null

  return (
    <div className="glass-effect border-b border-border/50 sticky top-0 z-50 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* App Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="gradient-primary w-10 h-10 rounded-xl flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-primary">
                  InternTrack
                </h1>
                <p className="text-xs text-muted-foreground">Document, Track, and Report</p>
              </div>
            </div>
          </div>

          {/* User Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-medium text-xs shadow-glow">
                {getInitials(user.email)}
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border/50 z-50 animate-fade-in">
                <div className="p-2">
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 