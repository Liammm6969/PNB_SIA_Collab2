import React, { useEffect, useState } from 'react';
import styles from './WelcomeOverlay.module.css';

const confettiPieces = Array.from({ length: 40 });
const rotatingPhrases = [
  'Effortlessly manage your finances',
  'Track transactions in real time',
  'Enjoy a secure, modern experience',
  'All-in-one digital banking dashboard',
  'Seamless, fast, and reliable'
];

export default function WelcomeOverlay({ show, onClose, userName }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!show) return;
    const fadeOut = setTimeout(() => setFade(false), 2200);
    const next = setTimeout(() => {
      setPhraseIdx((i) => (i + 1) % rotatingPhrases.length);
      setFade(true);
    }, 2500);
    return () => { clearTimeout(fadeOut); clearTimeout(next); };
  }, [phraseIdx, show]);

  if (!show) return null;
  return (
    <div className={styles['welcome-overlay']} onClick={onClose}>
      <div className={styles['welcome-content']}>
        <img src="/Logo.png" alt="Logo" className={styles['welcome-logo']} />
        <h1 className={styles['welcome-text']}>Welcome{userName ? `, ${userName}!` : '!'}</h1>
        <div className={styles['rotatingTextWrapper']}>
          <span className={fade ? styles['rotatingTextFadeIn'] : styles['rotatingTextFadeOut']}>
            {rotatingPhrases[phraseIdx]}
          </span>
        </div>
        <div className={styles['confetti-container']}>
          {confettiPieces.map((_, i) => (
            <div key={i} className={`${styles['confetti']} ${styles[`confetti-${i % 8}`]}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
} 