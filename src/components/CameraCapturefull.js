import React, { useState, useRef, useCallback } from 'react';
import './CameraCapture.css';

const CameraCapture = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((error) => {
            console.error("Error playing video:", error);
          });
          setIsStreamReady(true);
        };
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
      setIsStreamReady(false);
      setIsCameraActive(false);
    }
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && isStreamReady) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      onCapture(imageDataUrl);
      stopCamera();
    }
  }, [isStreamReady, onCapture, stopCamera]);

  const handleCameraToggle = useCallback(() => {
    if (isCameraActive) {
      stopCamera();
    } else {
      setIsCameraActive(true);
      startCamera();
    }
  }, [isCameraActive, startCamera, stopCamera]);

  return (
    <div>
        <button onClick={handleCameraToggle} className="button button-selected">
        {isCameraActive ? 'Close Camera' : 'Open Camera'}
      </button>
      {isCameraActive && (
        <>
          <video ref={videoRef} autoPlay playsInline className="video" />
          {isStreamReady && (
            <button onClick={captureImage} className="button button-capture">
              Capture Image
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CameraCapture;


