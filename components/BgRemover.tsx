'use client';

import { useState, useCallback, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import styles from './BgRemover.module.css';

type AppState = 'idle' | 'processing' | 'done' | 'error';

export default function BgRemover() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Analysing image...');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('cutout.png');
  const [comparing, setComparing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setFileName(file.name.replace(/\.[^.]+$/, '.png'));
    const objUrl = URL.createObjectURL(file);
    setOriginalUrl(objUrl);
    setAppState('processing');
    setProgress(0);
    setStatusText('Analysing image...');

    try {
      const blob = await removeBackground(file, {
        publicPath:
          'https://staticimgly.com/@imgly/background-removal/1.4.5/dist/',
        progress: (key: string, current: number, total: number) => {
          const pct = Math.round((current / total) * 100);
          setProgress(pct);
          if (pct > 40) setStatusText('Removing background...');
        },
        output: {
          format: 'image/png',
          quality: 1,
        },
      });

      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
      setAppState('done');
    } catch (err) {
      console.error(err);
      setAppState('error');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDownload = useCallback(() => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, [resultBlob, fileName]);

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setProgress(0);
    setComparing(false);
    setAppState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [originalUrl, resultUrl]);

  if (appState === 'idle') {
    return (
      <div
        className={`${styles.card} ${styles.cardIdle} ${isDragging ? styles.dragging : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div className={styles.uploadIcon}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 28V12M20 12L13 19M20 12L27 19"
              stroke="#6e6e73"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M8 32h24" stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p className={styles.uploadTitle}>Drop an image here</p>
        <p className={styles.uploadSub}>or click to upload</p>
        <p className={styles.uploadFormats}>JPG, PNG, WEBP supported</p>
      </div>
    );
  }

  if (appState === 'processing') {
    return (
      <div className={styles.card} style={{ padding: '24px' }}>
        <div className={styles.imageWrap}>
          {originalUrl && (
            <img src={originalUrl} alt="Processing" className={styles.previewImg} />
          )}
          <div className={styles.overlay} />
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.statusText}>{statusText}</p>
        </div>
      </div>
    );
  }

  if (appState === 'error') {
    return (
      <div className={`${styles.card} ${styles.errorCard}`}>
        <p className={styles.errorText}>
          Something went wrong. Please try a different image.
        </p>
        <button className={styles.btnGhost} onClick={reset}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.card} style={{ padding: '24px' }}>
      <div className={styles.resultWrap}>
        <div className={styles.checkerboard}>
          <img
            src={comparing ? (originalUrl ?? '') : (resultUrl ?? '')}
            alt={comparing ? 'Original' : 'Result'}
            className={styles.resultImg}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnPrimary} onClick={handleDownload}>
          Download PNG
        </button>
        <button className={styles.btnGhost} onClick={reset}>
          Try another image
        </button>
      </div>
      <button
        className={styles.btnCompare}
        onMouseDown={() => setComparing(true)}
        onMouseUp={() => setComparing(false)}
        onMouseLeave={() => setComparing(false)}
        onTouchStart={() => setComparing(true)}
        onTouchEnd={() => setComparing(false)}
      >
        Hold to compare
      </button>
    </div>
  );
}
