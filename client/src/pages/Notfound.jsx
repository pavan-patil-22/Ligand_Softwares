import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();
  const particlesRef = useRef(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const particles = Array.from({ length: 14 }).map(() => {
      const p = document.createElement('div');
      const isCyan = Math.random() > 0.5;
      Object.assign(p.style, {
        position: 'absolute',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        left: Math.random() * 100 + '%',
        top: (40 + Math.random() * 45) + '%',
        background: isCyan ? 'rgba(6,182,212,0.5)' : 'rgba(139,92,246,0.5)',
        opacity: (0.2 + Math.random() * 0.5).toString(),
        animation: `float-up-404 ${4 + Math.random() * 5}s ${Math.random() * 5}s linear infinite`,
        pointerEvents: 'none',
      });
      container.appendChild(p);
      return p;
    });

    return () => particles.forEach((p) => p.remove());
  }, []);

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes float-up-404 {
          0%   { transform: translateY(0)    scale(1); opacity: 0.6; }
          100% { transform: translateY(-200px) scale(0); opacity: 0; }
        }
        @keyframes shimmer-404 {
          0%   { background-position: 0%   center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink-dot {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes pulse-bar {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 1;   }
        }
      `}</style>

      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-dark-900">

        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)',
          }}
        />

        {/* Glow orbs */}
        <div className="absolute -top-20 -left-16 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-16 -right-12 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)' }} />

        {/* Floating particles container */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

        {/* Signal bars */}
        <div className="flex items-end gap-1 h-8 mb-5 relative z-10">
          {[10, 16, 24, 32, 22, 14, 8].map((h, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full"
              style={{
                height: h,
                background: [1, 2, 4].includes(i)
                  ? 'linear-gradient(to top, #8B5CF6, #06B6D4)'
                  : 'rgba(255,255,255,0.12)',
                animation: `pulse-bar 1.8s ${i * 0.15}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* 404 number */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 font-mono font-semibold leading-none"
          style={{
            fontSize: 'clamp(5rem, 18vw, 9rem)',
            letterSpacing: '-4px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 50%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            backgroundSize: '200% auto',
            animation: 'shimmer-404 3s linear infinite',
          }}
        >
          404
        </motion.h1>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative z-10 inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest mb-4 px-4 py-1.5 rounded-full"
          style={{
            color: '#8B5CF6',
            background: 'rgba(139,92,246,0.1)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#8B5CF6', animation: 'blink-dot 1.2s ease-in-out infinite' }}
          />
          PAGE_NOT_FOUND
        </motion.div>

        {/* Heading & description */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative z-10 font-outfit text-2xl md:text-3xl font-bold text-white mb-3"
        >
          Lost in the void
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative z-10 text-slate-400 max-w-sm leading-relaxed mb-8 text-sm md:text-base"
        >
          The page you're looking for has drifted into deep space. It may have been moved, deleted, or never existed.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative z-10 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-outfit font-bold text-sm tracking-wide text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 0 22px rgba(139,92,246,0.35)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Go back
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-outfit font-semibold text-sm tracking-wide text-slate-300 transition-all duration-200"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
              e.currentTarget.style.background = 'rgba(139,92,246,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '';
              e.currentTarget.style.borderColor = '';
              e.currentTarget.style.background = '';
            }}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </motion.div>

        {/* Path hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative z-10 mt-8 font-mono text-[11px] text-slate-600 tracking-wide"
        >
          <span className="text-primary-violet">~/</span>
          ligand-software
          <span className="text-primary-violet">/</span>
          ???
          <span className="text-primary-violet"> → </span>
          not found
        </motion.p>
      </section>
    </>
  );
}