"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./BgRemover.module.css";

type State = "idle" | "loading-model" | "processing" | "done" | "error";

export default function BgRemover() {
  const [state, setState] = useState<State>("idle");
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // cleanup object URLs
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, []);

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file (JPG, PNG, WebP).");
      setState("error");
      return;
    }

    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    const objUrl = URL.createObjectURL(file);
    setOriginalUrl(objUrl);
    setResultUrl(null);
    setShowOriginal(false);
    setProgress(0);
    setState("loading-model");
    setProgressLabel("Loading AI model…");

    try {
      const { removeBackground } = await import("@imgly/background-removal");

      const result = await removeBackground(file, {
        debug: false,
        output: {
          format: "image/png",
          quality: 0.9,
        },
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) {
            setState("loading-model");
            setProgressLabel("Downloading AI model… (first time only)");
          } else {
            setState("processing");
            setProgressLabel("Removing background…");
          }
          const pct = total > 0 ? Math.round((current / total) * 100) : 0;
          setProgress(pct);
        },
      });

      const url = URL.createObjectURL(result);
      setResultUrl(url);
      setState("done");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try a different image.");
      setState("error");
    }
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      processImage(file);
    },
    [processImage]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const reset = () => {
    setState("idle");
    setOriginalUrl(null);
    setResultUrl(null);
    setProgress(0);
    setProgressLabel("");
    setErrorMsg("");
  };

  const downloadResult = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = "cutout-result.png";
    a.click();
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* ── Upload zone ── */}
        {state === "idle" && (
          <div
            className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={onFileChange}
            />
            <div className={styles.dropzoneInner}>
              <div className={styles.uploadIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect width="40" height="40" rx="12" fill="#f0f0f0" />
                  <path
                    d="M20 26V14M14 20l6-6 6 6"
                    stroke="#999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className={styles.dropLabel}>Drop your image here</p>
              <p className={styles.dropSub}>or click to browse — JPG, PNG, WebP</p>
              <button className={styles.uploadBtn} tabIndex={-1}>
                Select Image
              </button>
            </div>
          </div>
        )}

        {/* ── Processing ── */}
        {(state === "loading-model" || state === "processing") && (
          <div className={styles.processingBox}>
            {originalUrl && (
              <div className={styles.processingPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={originalUrl} alt="Processing" className={styles.processingImg} />
                <div className={styles.processingOverlay}>
                  <div className={styles.spinner} />
                </div>
              </div>
            )}
            <div className={styles.progressInfo}>
              <p className={styles.progressLabel}>{progressLabel}</p>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
              <p className={styles.progressPct}>{progress}%</p>
            </div>
            {state === "loading-model" && (
              <p className={styles.hint}>
                The AI model downloads once (~40 MB) and is cached locally.
              </p>
            )}
          </div>
        )}

        {/* ── Result ── */}
        {state === "done" && resultUrl && (
          <div className={styles.resultBox}>
            <div className={styles.resultPreview}>
              <div className={styles.checkerboard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={showOriginal ? originalUrl! : resultUrl}
                  alt={showOriginal ? "Original" : "Background removed"}
                  className={styles.resultImg}
                />
              </div>
              <button
                className={styles.toggleBtn}
                onMouseDown={() => setShowOriginal(true)}
                onMouseUp={() => setShowOriginal(false)}
                onTouchStart={() => setShowOriginal(true)}
                onTouchEnd={() => setShowOriginal(false)}
              >
                {showOriginal ? "Showing original" : "Hold to compare"}
              </button>
            </div>

            <div className={styles.resultActions}>
              <button className={styles.downloadBtn} onClick={downloadResult}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2v8m0 0l-3-3m3 3l3-3M3 12h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download PNG
              </button>
              <button className={styles.newBtn} onClick={reset}>
                New image
              </button>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {state === "error" && (
          <div className={styles.errorBox}>
            <p className={styles.errorText}>{errorMsg}</p>
            <button className={styles.newBtn} onClick={reset}>
              Try again
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
