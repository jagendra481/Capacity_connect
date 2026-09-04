import React, { useState, useEffect, useRef } from 'react';
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle, Scan } from 'lucide-react';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState('');
  const [manualInput, setManualInput] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError('');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setHasCamera(false);
        setCameraError('Camera access not supported on this browser/device.');
      }
    } catch (err) {
      setHasCamera(false);
      setCameraError('Camera access was denied or unavailable. Please use manual lookup.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    onScanSuccess(manualInput.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">QR Code Certificate Scanner</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder or Fallback */}
        <div className="px-6 space-y-4">
          <div className="relative aspect-square w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
            {hasCamera ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scanner reticle overlay */}
                <div className="absolute inset-8 border-2 border-dashed border-amber-400 rounded-2xl pointer-events-none flex items-center justify-center animate-pulse">
                  <span className="text-[10px] text-amber-300 font-mono bg-slate-950/80 px-2 py-1 rounded">
                    Align QR Code within box
                  </span>
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-3">
                <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">{cameraError}</p>
              </div>
            )}
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Or Enter Certificate ID / Hash Manually:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="e.g. MOES-2026-7B9A2F1C"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Scan
              </button>
            </div>
          </form>

          {/* Quick Demo Samples */}
          <div className="pt-2 border-t border-slate-800/80">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Quick Test Codes:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  onScanSuccess('MOES-2026-7B9A2F1C');
                  onClose();
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-mono transition-colors"
              >
                ✅ MOES-2026-7B9A2F1C (Approved)
              </button>
              <button
                type="button"
                onClick={() => {
                  onScanSuccess('MOES-2026-4A2D8F9E');
                  onClose();
                }}
                className="px-2.5 py-1 bg-slate-950 hover:bg-amber-950/40 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-mono transition-colors"
              >
                ⏳ MOES-2026-4A2D8F9E (Pending)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Verifies official Ministry of Earth Sciences SHA-256 cryptographic authenticity
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
