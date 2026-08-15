import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Images, RotateCcw, Zap, Check, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
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
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
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
        const compressed = await compressImage(blob); // blob is PNG (lossless), compressImage encodes to WebP
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
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#CC0000', '#fff', '#000'],
        });
        setShowSuccessAnim(true);

        setTimeout(() => {
          setShowSuccessAnim(false);
          setUploading(false);
        }, 2000);
      } catch (err) {
        setError(`Upload failed: ${err.message}`);
        setUploading(false);
      }
    }, 'image/png');
  }

  function playShutterAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'shutter';
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 300);
  }


  return (
    <div className="camera-container">
      <div className="camera-header">
        <button onClick={() => navigate('/')} className="nav-btn back-btn" title="Kembali">
          <ArrowLeft size={20} />
        </button>
        <span className="camera-label">KAMERA</span>
        <button onClick={() => navigate('/gallery')} className="nav-btn gallery-btn" title="Lihat galeri">
          <Images size={20} />
        </button>
      </div>

      {/* <div className="camera-public-tag">
        <Globe size={13} />
        <span>Foto yang kamu jepret akan tampil publik di Galeri Warga</span>
      </div> */}

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
      </div>

      {!error && (
        <div className="camera-controls">
          <button
            onClick={toggleFlash}
            className={`control-btn flash-btn ${flashOn ? 'active' : ''}`}
            title={flashOn ? 'Flash on' : 'Flash off'}
          >
            <Zap size={22} />
          </button>

          <div className="shutter-wrapper">
            {showSuccessAnim && (
              <span className="success-spark">
                <Check size={18} />
              </span>
            )}
            <button
              onClick={capturePhoto}
              disabled={uploading}
              className={`shutter-btn ${uploading ? 'loading' : ''}`}
              title={uploading ? 'Uploading...' : 'Ambil foto'}
            >
              {uploading ? (
                <span className="loading-spinner"></span>
              ) : (
                <span className="shutter-icon">●</span>
              )}
            </button>
          </div>

          <button
            onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')}
            className="control-btn flip-btn"
            disabled={uploading}
            title="Tukar kamera"
          >
            <RotateCcw size={22} />
          </button>
        </div>
      )}
    </div>
  );
}
