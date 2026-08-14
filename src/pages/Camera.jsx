import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { compressImage, generateFileName } from '../lib/image';
import './Camera.css';

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [facingMode, setFacingMode] = useState('environment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    if (facingMode !== 'environment') {
      stopCamera();
      startCamera();
    }
  }, [facingMode]);

  async function startCamera() {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setLoading(false);
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Kamera tidak diizinkan. Periksa izin di pengaturan.'
          : 'Tidak dapat mengakses kamera.'
      );
      setLoading(true);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }

  async function toggleFlash() {
    try {
      const track = streamRef.current?.getVideoTracks()[0];
      if (!track) return;
      await track.applyConstraints({ advanced: [{ torch: !flashOn }] });
      setFlashOn(!flashOn);
    } catch (err) {
      // ponytail: flash not supported (iOS/desktop) — silently ignore
    }
  }

  async function capturePhoto() {
    if (uploading || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError('Failed to capture photo');
        return;
      }

      setUploading(true);
      try {
        const compressed = await compressImage(blob);
        const fileName = generateFileName();

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(`photos/${fileName}`, compressed, {
            contentType: 'image/jpeg',
          });

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase.from('photos').insert({
          storage_path: `photos/${fileName}`,
        });

        if (dbError) throw dbError;

        playShutterAnimation();
        playConfetti();
        setSuccess(true);

        setTimeout(() => {
          setSuccess(false);
          setUploading(false);
        }, 2000);
      } catch (err) {
        setError(`Upload failed: ${err.message}`);
        setUploading(false);
      }
    }, 'image/jpeg', 0.8);
  }

  function playShutterAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'shutter';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 300);
  }

  function playConfetti() {
    const container = document.querySelector('.camera-container');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.textContent = ['🎉', '📸', '🇮🇩', '⭐', '🎊'][Math.floor(Math.random() * 5)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animation = `fall ${2 + Math.random() * 1}s linear`;
      container.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }

  return (
    <div className="camera-container">
      <div className="camera-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Kembali
        </button>
        <button onClick={() => navigate('/gallery')} className="gallery-btn">
          Galeri →
        </button>
      </div>

      <div className="camera-wrapper">
        {!error && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          />
        )}

        {error && <div className="camera-error">{error}</div>}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {success && <div className="success-message">Foto terkirim! 📸</div>}
      </div>

      {!error && (
        <div className="camera-controls">
          <button
            onClick={toggleFlash}
            className={`control-btn ${flashOn ? 'active' : ''}`}
            title="Toggle flash"
          >
            💡
          </button>

          <button
            onClick={capturePhoto}
            disabled={uploading}
            className={`shutter-btn ${uploading ? 'loading' : ''}`}
            title={uploading ? 'Uploading...' : 'Take photo'}
          >
            {uploading ? '⏳' : '●'}
          </button>

          <button
            onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')}
            className="control-btn flip-btn"
            disabled={uploading}
            title="Switch camera"
          >
            ↻
          </button>
        </div>
      )}
    </div>
  );
}
