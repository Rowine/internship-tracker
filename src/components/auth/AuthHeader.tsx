import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function AuthHeader() {
  const { user, signOut } = useAuth()

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {user.email}
              </p>
              <p className="text-xs text-gray-500">
                ID: {user.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          <Button
            onClick={handleSignOut}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
} 