import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, User, Lock, Mail, AlertCircle, Rocket, Sparkles, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

type AuthMode = 'login' | 'signup'

interface AuthPageProps {
  onSuccess?: () => void
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const { signIn, signUp, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setFormLoading(true)
    clearError()
    setMessage(null)

    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (!error) {
        onSuccess?.()
      }
    } else {
      const { data, error } = await signUp(email, password)
      if (!error) {
        if (data.user && !data.session) {
          // Email confirmation required
          setMessage('Check your email for the confirmation link to complete your registration.')
        } else {
          // User is signed up and signed in
          onSuccess?.()
        }
      }
    }

    setFormLoading(false)
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    clearError()
    setMessage(null)
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen gradient-hero flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex flex-1 flex-col justify-center px-12 py-16">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="relative">
            <div className="bg-primary w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-glow">
              <Rocket className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Welcome to <span className="text-primary font-extrabold">InternTrack</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Document your internship hours and create reports for advisors
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-glow">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Log Your Hours</p>
                <p className="text-sm text-muted-foreground">Document daily internship activities and time</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-muted-foreground rounded-lg flex items-center justify-center shadow-glow">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Generate Reports</p>
                <p className="text-sm text-muted-foreground">Create detailed reports for advisors and supervisors</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Meet Requirements</p>
                <p className="text-sm text-muted-foreground">Fulfill academic and program requirements easily</p>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              "InternTrack made it so easy to track my hours and submit comprehensive reports to my academic advisor!"
            </p>
            <p className="text-xs font-medium text-foreground mt-2">- Sarah K., Business Administration Student</p>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <div className="bg-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-glow mb-4">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Welcome to <span className="text-primary font-extrabold">InternTrack</span>
            </h2>
          </div>

          {/* Form Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              {isLogin ? 'Welcome back!' : 'Start your journey'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? 'Sign in to continue documenting your internship' : 'Create your account and start logging hours'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="glass-effect rounded-2xl p-8 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-border/20 focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter your email"
                    />
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-border/20 focus:border-primary/50 focus:ring-primary/20"
                      placeholder="Enter your password"
                    />
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <button
                      type="button"
                      className="absolute right-3 top-3 h-5 w-5 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="glass-effect rounded-xl p-4 border border-destructive/20 bg-destructive/10">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="ml-3 text-sm text-destructive font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {message && (
                <div className="glass-effect rounded-xl p-4 border border-info/20 bg-info/10">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-info flex-shrink-0" />
                    <p className="ml-3 text-sm text-info font-medium">
                      {message}
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={formLoading || !email || !password}
                className="w-full gradient-primary hover:shadow-glow transition-all duration-300 transform hover:scale-105 h-12 font-semibold"
              >
                {formLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent mr-3"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in to InternTrack' : 'Create your account'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="ml-2 font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              {!isLogin && (
                <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border/20">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                  We're committed to helping you track and report your internship experience effectively.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 