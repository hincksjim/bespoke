import React, { useState, useRef, useCallback } from 'react';
import './CameraCapture.css';

// This file defines the CameraCapture component, which provides a simplified camera capture interface.
// It allows users to start/stop the camera and capture an image from the video stream.

// This component provides a simplified camera capture interface.
// It allows users to start/stop the camera and capture an image.

const CameraCapture = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStreamReady, setIsStreamReady] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  /**
   * startCamera Function
   * This function initializes the camera stream and streams the video to the video element.
   * It sets the stream as the source for the video element and starts playback.
   */
  // Starts the camera and streams the video to the video element
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

  /**
   * stopCamera Function
   * This function stops the camera stream and releases the media resources.
   * It also resets the component's state to indicate the camera is inactive.
   */
  // Stops the camera and releases the media stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
      setIsStreamReady(false);
      setIsCameraActive(false);
    }
  }, []);

  /**
   * captureImage Function
   * This function captures the current frame from the video stream as an image.
   * It uses a canvas element to draw the video frame and generates a data URL for the image.
   */
  // Captures the current frame from the video stream as an image
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

  /**
   * handleCameraToggle Function
   * This function toggles the camera on or off based on its current state.
   * It starts the camera if inactive and stops it if active.
   */
  // Toggles the camera on or off
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


