import { useNavigate } from 'react-router-dom';
import { 
  BrainCircuit,
  Brain,
  Shield,
  Lock,
  Cpu,
  Eye,
  BarChart3,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  Target,
  Rocket,
  Activity,
  Monitor
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleTryItOut = () => {
    navigate('/consent');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Animated lemon orbs */}
        <div className="absolute w-[1000px] h-[1000px] -top-64 -left-64 bg-gradient-radial from-yellow-400/10 via-transparent to-transparent rounded-full blur-3xl opacity-10 animate-orbit" 
             style={{ animationDuration: '30s' }} />
        <div className="absolute w-[800px] h-[800px] -bottom-96 -right-96 bg-gradient-radial from-yellow-500/8 via-transparent to-transparent rounded-full blur-3xl opacity-8 animate-orbit"
             style={{ animationDuration: '35s' }} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, rgba(253, 224, 71, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(253, 224, 71, 0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        
        {/* Floating lemon particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-yellow-400/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${20 + Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      
      <nav className="relative z-10 border-b border-gray-600/90 bg-gray-1000 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <div className="relative">
              <BrainCircuit className="w-8 h-8 text-yellow-300" />
              <div className="absolute -inset-2 bg-yellow-500/10 blur-xl rounded-full" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
  Mind X
</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden md:inline">
              Cognitive Performance Analytics
            </span>
            <div className="status-live text-xs">
            FREE
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-32 md:pt-12 md:pb-48">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated attention orb */}
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="attention-orb w-full h-full">
                <div className="relative z-10">
                  <BrainCircuit className="w-16 h-16 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-xl opacity-10" />
                </div>
                <div className="pulse-ring" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text">
                Mind X
              </span>
              <br />
              <span className="text-gray-300 ">Powered by AI</span>
            </h1>

            {/* Catchphrase */}
            <p className="text-2xl md:text-3xl text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto">
              Real-time attention analytics that illuminate your cognitive patterns.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleTryItOut}
              className="btn-neon px-10 py-5 text-lg font-semibold group"
            >
              <span className="flex items-center gap-3">
                <Rocket className="w-6 h-6" />
                Illuminate Your Focus
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
              </span>
            </button>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-6 border-t border-gray-800/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm text-gray-400">No installation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm text-gray-400">100% private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm text-gray-400">Instant insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10  ">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Illuminate
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                See your focus patterns in brilliant detail with our cutting-edge tracking technology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20 stagger-children">
              <div className="metric-card group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl gradient-lemon-dark">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">Real-time Metrics</h3>
                </div>
                <p className="text-gray-400">
                  Monitor attention span and focus patterns with millisecond precision.
                  Visualize your cognitive state in vibrant detail.
                </p>
              </div>

              <div className="metric-card group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl gradient-lemon-dark">
                    <Cpu className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">AI-Powered Insights</h3>
                </div>
                <p className="text-gray-400">
                  Advanced neural networks analyze your behavior to provide intelligent
                  recommendations for optimal focus.
                </p>
              </div>

              <div className="metric-card group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl gradient-lemon-dark">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100">Focus Optimization</h3>
                </div>
                <p className="text-gray-400">
                  Identify distractions and optimize your workflow. Get alerts when attention
                  drifts with actionable suggestions.
                </p>
              </div>
            </div>

            {/* Security Section */}
            <div className="consent-card max-w-4xl mx-auto">
              <div className="flex items-start gap-6 mb-8">
                <div className="flex-none">
                  <div className="p-4 rounded-2xl gradient-lemon-dark shadow-xl">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-yellow-400">
                      Enterprise-Grade Security
                    </h2>
                    <Lock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    All data processing occurs locally in real-time. No personal data is stored or 
                    transmitted to external servers. Your privacy is protected with advanced encryption 
                    and automatic session cleanup.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-800/50">
                    <div className="flex items-start gap-3">
                      <div className="flex-none p-2 rounded-lg bg-yellow-400/10">
                        <Clock className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-100 mb-1">Real-time Only</h4>
                        <p className="text-sm text-gray-400">Data exists only during active session</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="flex-none p-2 rounded-lg bg-yellow-400/10">
                        <Zap className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-100 mb-1">Local Processing</h4>
                        <p className="text-sm text-gray-400">No data leaves your device</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              <span className="text-yellow-400">How It Works</span>
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex-none w-12 h-12 rounded-xl gradient-lemon-dark flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Start Session</h3>
                  <p className="text-gray-400">
                    Click "Illuminate Your Focus" and grant permission for non-invasive tracking.
                    No account required.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex-none w-12 h-12 rounded-xl gradient-lemon-dark flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Real-time Tracking</h3>
                  <p className="text-gray-400">
                    Work naturally while our system monitors mouse activity, tab switches, 
                    and attention patterns in real-time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 p-6 rounded-2xl bg-gray-900/50 border border-gray-800/50 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex-none w-12 h-12 rounded-xl gradient-lemon-dark flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">Get Illuminated Insights</h3>
                  <p className="text-gray-400">
                    View your focus analytics dashboard with personalized recommendations 
                    to optimize your productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent blur-3xl" />
              <div className="relative p-12 rounded-3xl glass border border-yellow-400/20">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-100">
                  Ready to Illuminate Your Focus?
                </h2>
                <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                  Join thousands who have discovered their cognitive patterns with NeuroFocus.
                  No sign-up required. Just pure, brilliant analytics.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleTryItOut}
                    className="btn-neon px-10 py-4 text-lg font-semibold group"
                  >
                    <span className="flex items-center gap-3">
                      <BrainCircuit className="w-6 h-6" />
                      Illuminate Now - Free
                      <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                    </span>
                  </button>
                  
                  <button className="btn-outline-neon px-10 py-4 text-lg font-semibold">
                    View Demo
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mt-8">
                  No credit card • No installation • Privacy-first
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800/50 py-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <BrainCircuit className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">Mind X</span>
            </div>
            
            <div className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} MindX Analytics. All rights reserved.
            </div>
            
            <div className="text-sm text-gray-500 flex items-center gap-4">
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}