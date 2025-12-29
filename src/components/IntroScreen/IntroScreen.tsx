import { useState, useEffect, useCallback } from 'react';
import Orb from '../UI/Orb';
import './IntroScreen.css';

interface IntroScreenProps {
    onComplete: () => void;
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
    const [textPhase, setTextPhase] = useState(0);
    const [isWarping, setIsWarping] = useState(false);
    const [showButton, setShowButton] = useState(false);

    // Typewriter text phases
    const texts = [
        { title: 'LANCE is awakening...', subtitle: '' },
        { title: 'AI', subtitle: 'Resume Builder' },
    ];

    useEffect(() => {
        // Phase 1: Initial text
        const timer1 = setTimeout(() => {
            setTextPhase(1);
        }, 2500);

        // Show button after text animation
        const timer2 = setTimeout(() => {
            setShowButton(true);
        }, 3500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    const handleEnter = useCallback(() => {
        if (isWarping) return;

        setIsWarping(true);

        // Wait for warp animation to complete
        setTimeout(() => {
            onComplete();
        }, 1200);
    }, [isWarping, onComplete]);

    // Generate random particles for warp effect
    const particles = Array.from({ length: 50 }, (_, i) => {
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 50 + Math.random() * 50;
        const startX = 50 + Math.cos(angle) * distance;
        const startY = 50 + Math.sin(angle) * distance;
        const delay = Math.random() * 0.5;

        return (
            <div
                key={i}
                className="warp-particle"
                style={{
                    left: `${startX}%`,
                    top: `${startY}%`,
                    animationDelay: `${delay}s`,
                    transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                }}
            />
        );
    });

    return (
        <div className={`intro-screen ${isWarping ? 'warping' : ''}`}>
            {/* Warp particles */}
            <div className="warp-particles">
                {particles}
            </div>

            {/* Main orb */}
            <div className="intro-orb-container" onClick={handleEnter}>
                <div className="orb-glow" />
                <Orb
                    hue={0}
                    hoverIntensity={0.5}
                    rotateOnHover={true}
                    forceHoverState={isWarping}
                    backgroundColor="#0a0a0a"
                />
            </div>

            {/* Text */}
            <div className="intro-text">
                <h1 className="intro-title">
                    <span className={textPhase === 0 ? 'typewriter' : ''}>
                        {texts[textPhase].title}
                    </span>
                </h1>
                {texts[textPhase].subtitle && (
                    <p className="intro-subtitle">{texts[textPhase].subtitle}</p>
                )}
            </div>

            {/* Enter button */}
            {showButton && (
                <button className="enter-button" onClick={handleEnter}>
                    Click to start
                </button>
            )}

            {/* Hint */}
            <span className="click-hint">Click the orb or button to begin</span>
        </div>
    );
}

export default IntroScreen;
