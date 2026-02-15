import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  MousePointer2, 
  Monitor, 
  Camera, 
  Shield, 
  Clock,
  ArrowRight,
  Zap,
  Lock,
  Cpu,
  BrainCircuit
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const dataPoints = [
  {
    icon: MousePointer2,
    title: 'Mouse Activity',
    description: 'Movement patterns and click frequency',
    gradient: 'gradient-lemon-dark',
  },
  {
    icon: Monitor,
    title: 'Tab Switches',
    description: 'Window focus and tab change events',
    gradient: 'gradient-lemon-dark',
  },
  {
    icon: Camera,
    title: 'Camera (Optional)',
    description: 'Gaze and blink detection for enhanced tracking',
    gradient: 'gradient-lemon-dark',
  },
  {
    icon: Cpu,
    title: 'Cognitive Load',
    description: 'Real-time attention span analysis',
    gradient: 'gradient-lemon-dark',
  },
];

export default function ConsentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleAccept = async () => {
    setIsLoading(true);
    const sessionId = uuidv4();
    
    // Add subtle lemon particle effect
    const particles = document.createElement('div');
    particles.className = 'fixed inset-0 pointer-events-none z-50';
    particles.innerHTML = Array.from({ length: 15 }, (_, i) => 
      `<div class="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 animate-float opacity-70" 
            style="left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation-delay: ${i * 0.1}s;"></div>`
    ).join('');
    document.body.appendChild(particles);
    
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setTimeout(() => {
      particles.remove();
      navigate(`/dashboard/${sessionId}`);
    }, 500);
  };

  const handleDecline = () => {
    
    navigate('/')
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10 md:p-10 bg-gradient-to-br from-gray-1000 via-black to-gray-900 overflow-hidden relative">
      
      {/* Background effects with lemon theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />
        
        {/* Lemon gradient orbs */}
        <div 
          className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-radial from-yellow-400/10 via-transparent to-transparent rounded-full blur-3xl opacity-15 animate-orbit" 
          style={{ animationDuration: '25s' }} 
        />
        <div 
          className="absolute w-[600px] h-[600px] -bottom-32 -right-32 bg-gradient-radial from-yellow-300/8 via-transparent to-transparent rounded-full blur-2xl opacity-10 animate-orbit"
          style={{ animationDuration: '30s' }} 
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(to right, rgba(253, 224, 71, 0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(253, 224, 71, 0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Consent Card with lemon theme */}
      <div 
        className="consent-card max-w-3xl p-10 md:p-12 animate-scale-in z-10"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(true)}
        
      >
        

        {/* Header */}
        <div className="relative text-center mb-10">
          <div className="attention-orb w-20 h-20 mx-auto mb-6 shadow-2xl animate-float">
            <div className="relative z-10">
              <BrainCircuit className="w-10 h-10 text-white drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full blur-xl opacity-30" />
            </div>
            <div className="pulse-ring" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Mind X
            </h1>
          </div>
          
          <p className="text-base text-gray-400 max-w-lg mx-auto leading-relaxed">
            Advanced cognitive monitoring for peak performance. 
            Understand your focus patterns in real-time with our AI-powered attention tracking.
          </p>
        </div>

        {/* Data Collection */}
        <div className="space-y-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Real-Time Analytics Collected
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {dataPoints.map((point) => (
              <div key={point.title} className="data-point group hover:scale-[1.02]">
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`flex-none p-2.5 rounded-lg ${point.gradient} shadow-md`}>
                    <point.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100 mb-1 flex items-center gap-2">
                      {point.title}
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Session info */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-900/50 to-gray-800/30 border border-gray-800/50 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-300/20">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-medium text-gray-100 text-sm">Session Duration</p>
              <p className="text-xs text-gray-400">Continuous monitoring until manually stopped</p>
            </div>
          </div>
          <div className="status-live">
            LIVE
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="btn-neon flex-1 relative overflow-hidden group"
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-gradient-lemon font-semibold">Initializing ...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <span className="font-semibold text-lg text-black bg-clip-text ">
                  Begin Session
                </span>
                <ArrowRight className="w-6 h-6 text-black transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
              </span>
            )}
            
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 opacity-0 group-hover:opacity-15 blur-xl transition-opacity duration-500" />
          </button>

          <button
            className="btn-outline-neon flex-1 sm:flex-none hover:text-yellow-300"
            onClick={handleDecline}
            disabled={isLoading}
          >
            <span className="font-medium">Decline & Exit</span>
          </button>
        </div>

        {/* Footer note */}
        <div className="mt-8 pt-6 border-t border-gray-800/50">
          <p className="text-xs text-center text-gray-500">
            By continuing, you agree to our {' '}
            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors underline underline-offset-2">
              Terms of Service
            </a>
            {' '} and acknowledge our {' '}
            <a href="#" className="text-yellow-400 hover:text-yellow-300 transition-colors underline underline-offset-2">
              Privacy Policy
            </a>
          </p>
        </div>

      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] rounded-full bg-yellow-400/20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}