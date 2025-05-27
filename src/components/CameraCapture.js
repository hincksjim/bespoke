import React, { useState, useRef, useCallback, useEffect } from 'react';
import './CameraCapture.css'; // Import the CSS file

// This file defines the CameraCapture component, which provides a camera capture interface with drawing capabilities.
// It allows users to capture images and draw bounding boxes for specific areas on the video stream.

// This component provides a camera capture interface with drawing capabilities.
// It allows users to capture images and draw bounding boxes for specific areas.

const CameraCapture = ({ onCapture }) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isStreamReady, setIsStreamReady] = useState(false); // Keep for button logic/UI
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
    const [drawnBoundingBox, setDrawnBoundingBox] = useState(null); // Stores the final drawn box {x, y, width, height}
    const [capturedImageData, setCapturedImageData] = useState(null); // Stores the captured image data
    const [errorMessage, setErrorMessage] = useState(''); // State to hold error messages

    const videoRef = useRef(null);
    const canvasRef = useRef(null); // Ref for the canvas element
    const streamRef = useRef(null);
    const animationFrameIdRef = useRef(null); // To hold the requestAnimationFrame ID
    const isDetectingRef = useRef(false); // Explicitly control detection loop - Used for drawFrame now


    // --- Drawing Loop ---
    const drawFrame = useCallback(() => {
        const context = canvasRef.current?.getContext('2d');
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // console.log('drawFrame: Checking exit conditions.', {
        //     isDetecting: isDetectingRef.current,
        //     context: !!context,
        //     video: !!video,
        //     canvas: !!canvas,
        //     readyState: video?.readyState
        // });


        if (!isDetectingRef.current || !context || !video || !canvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) { // Check video readyState
            // console.log('drawFrame: Exit conditions met. Stopping loop.'); // Reduce log spam
            if (animationFrameIdRef.current) {
                 cancelAnimationFrame(animationFrameIdRef.current);
                 animationFrameIdRef.current = null;
            }
            return;
        }


        // console.log('drawFrame: Attempting to draw video frame.'); // Reduce log spam


        // Draw the current video frame onto the canvas
        try {
             context.drawImage(video, 0, 0, canvas.width, canvas.height);
        } catch (error) {
            console.error("Error drawing video frame to canvas:", error);
            // This might catch silent failures
             stopDrawingLoop(); // Attempt to stop the loop if drawing fails
             setErrorMessage("Error rendering video stream."); // Inform user
             return; // Exit this frame
        }


        // If currently drawing, draw the rubberband rectangle
        if (isDrawing) { // <--- This block for the temporary box
            // console.log('drawFrame: isDrawing is true. Drawing rubberband.', { startPos, currentPos }); // Log positions while drawing - Reduce log spam
            context.strokeStyle = 'cyan';
            context.lineWidth = 2;
            const width = currentPos.x - startPos.x;
            const height = currentPos.y - startPos.y;
            context.strokeRect(startPos.x, startPos.y, width, height);
        } else if (drawnBoundingBox) { // <--- This block for the persistent box
            // If a box is already drawn, redraw it persistently
            console.log('drawFrame: drawnBoundingBox exists. Drawing persistent box.'); // Log when drawing persistent box
            context.strokeStyle = 'cyan';
            context.lineWidth = 2;
             context.strokeRect(drawnBoundingBox.x, drawnBoundingBox.y, drawnBoundingBox.width, drawnBoundingBox.height);
             // Optional: add a label to the drawn box
             context.font = '18px Arial';
             context.fillStyle = 'cyan';
             const text = 'Selected Area';
              const textWidth = context.measureText(text).width;
              const textX = Math.max(drawnBoundingBox.x, 0);
              const textY = drawnBoundingBox.y > 20 ? drawnBoundingBox.y - 5 : drawnBoundingBox.y + 20; // Position above or below
              const adjustedTextX = Math.min(textX, canvas.width - textWidth); // Prevent text overflow


             context.fillText(text, adjustedTextX, textY);
        }

         // console.log('drawFrame: Requesting next frame.'); // Reduce log spam


        // Request the next frame
        animationFrameIdRef.current = requestAnimationFrame(drawFrame);


    }, [isDrawing, startPos, currentPos, drawnBoundingBox]); // Dependencies for useCallback


    const startDrawingLoop = useCallback(() => {
         isDetectingRef.current = true; // Signal the drawing loop to run
        if (!animationFrameIdRef.current) {
             console.log('Starting drawing loop.');
            drawFrame(); // Start the first frame
        }
    }, [drawFrame]); // Dependency on drawFrame

    const stopDrawingLoop = useCallback(() => {
         console.log('Stopping drawing loop.');
         isDetectingRef.current = false; // Signal the drawing loop to stop
         if (animationFrameIdRef.current) {
             cancelAnimationFrame(animationFrameIdRef.current);
             animationFrameIdRef.current = null;
         }
    }, []); // No dependencies


    // --- Video Stream ---
    const startCamera = useCallback(async () => {
        console.log('Attempting to start camera stream...');
        setErrorMessage(''); // Clear any previous error messages
        setIsStreamReady(false); // Set ready state to false while starting

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;

            if (videoRef.current) {
                 videoRef.current.srcObject = stream;

                 videoRef.current.onloadedmetadata = () => {
                     console.log('Video metadata loaded.');
                     if (canvasRef.current && videoRef.current) {
                         const videoElement = videoRef.current;
                         if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                              // Set internal canvas dimensions to match video
                              canvasRef.current.width = videoElement.videoWidth;
                              canvasRef.current.height = videoElement.videoHeight;

                              // --- START MODIFICATION: Set display height to maintain aspect ratio ---
                              const aspectRatio = videoElement.videoHeight / videoElement.videoWidth;
                              // Get the actual rendered width of the canvas after CSS is applied
                              // Use offsetWidth as it reflects the layout width
                              const renderedWidth = canvasRef.current.offsetWidth;
                              const calculatedDisplayHeight = renderedWidth * aspectRatio;
                              canvasRef.current.style.height = `${calculatedDisplayHeight}px`; // Apply calculated display height
                              canvasRef.current.style.display = 'block';
                              console.log(`Canvas internal dimensions set to ${canvasRef.current.width}x${canvasRef.current.height}. Display size set to ${renderedWidth}x${calculatedDisplayHeight.toFixed(2)}`); // Log calculated display size
                              // --- END MODIFICATION ---

                         } else {
                              console.warn('Video dimensions are not available or are zero in onloadedmetadata. Canvas not sized properly.');
                              setErrorMessage("Could not determine video dimensions. Cannot capture.");
                              setIsStreamReady(false); // Cannot be ready if dimensions are bad
                         }
                     } else {
                         console.warn('Refs not available in onloadedmetadata.');
                     }
                 };

                 videoRef.current.onplaying = () => {
                     console.log('Video is playing.');
                     // Only set stream ready if dimensions were valid
                     if (canvasRef.current && canvasRef.current.width > 0 && canvasRef.current.height > 0) {
                          setIsStreamReady(true);
                           // Request a frame *after* playing starts and state is updated
                           requestAnimationFrame(() => {
                                console.log('Requesting animation frame after playing.');
                                startDrawingLoop(); // Start the drawing loop in the next animation frame
                           });
                     } else {
                         console.warn('Video playing, but canvas dimensions invalid. Stream not marked as ready.');
                         setErrorMessage(prev => prev || "Video is playing, but canvas dimensions are incorrect."); // Add error if not already set
                         setIsStreamReady(false);
                     }
                 };

                 // Attempt to play the video
                 videoRef.current.play().catch((error) => {
                     console.error("Error playing video:", error);
                     setErrorMessage("Autoplay prevented. Click video or grant permission."); // Inform user
                     setIsStreamReady(false); // Ensure this is false if play fails
                 });

            } else {
                console.warn('Video ref not available when trying to set srcObject.');
                setErrorMessage("Internal error: Video element not found.");
                setIsStreamReady(false);
            }
        } catch (err) {
            console.error("Error accessing the camera:", err);
            setErrorMessage(`Error accessing camera: ${err.message || err}`); // Provide user-friendly error
            setIsCameraActive(false); // Ensure button state is correct on error
            setIsStreamReady(false);
        }
    }, [startDrawingLoop, stopDrawingLoop]);


    /**
     * stopCamera Function
     * This function stops the camera stream, clears the canvas, and resets the component's state.
     * It ensures all resources are released and the UI is updated accordingly.
     */
    const stopCamera = useCallback(() => {
        console.log('Stopping camera...');

        stopDrawingLoop();

        if (streamRef.current) {
            const tracks = streamRef.current.getTracks();
            tracks.forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
             videoRef.current.onloadedmetadata = null;
             videoRef.current.onplaying = null;
             // Reset canvas display height when stopping
             if (canvasRef.current) {
                 canvasRef.current.style.height = '';
             }
        }

        if (canvasRef.current) {
             const context = canvasRef.current.getContext('2d');
             if (context) {
                 context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
             }
              canvasRef.current.style.display = 'none';
             console.log('Canvas cleared and hidden.');
        }
        setIsStreamReady(false);
        setIsCameraActive(false);
        setIsDrawing(false);
        setStartPos({ x: 0, y: 0 });
        setCurrentPos({ x: 0, y: 0 });
        setDrawnBoundingBox(null);
        setCapturedImageData(null);
        setErrorMessage('');
        console.log('Camera stopped and states reset.');
    }, [stopDrawingLoop]);


    // --- Mouse/Touch Drawing Handlers ---
    const getCanvasCoordinates = (event) => {
         const canvas = canvasRef.current;
         if (!canvas) return { x: 0, y: 0 };

         const rect = canvas.getBoundingClientRect();
         const scaleX = canvas.width / rect.width;
         const scaleY = canvas.height / rect.height;

         const x = (event.clientX - rect.left) * scaleX;
         const y = (event.clientY - rect.top) * scaleY;

         return { x, y };
    };


    /**
     * handleMouseDown Function
     * This function starts the drawing process when the user clicks on the canvas.
     * It records the starting position of the bounding box and sets the drawing state to active.
     */
    const handleMouseDown = (event) => {
        console.log('handleMouseDown called.', { isStreamReady, drawnBoundingBox: !!drawnBoundingBox, button: event.button });
        if (!isStreamReady || drawnBoundingBox || event.button !== 0 || !canvasRef.current) return;
        const pos = getCanvasCoordinates(event);
        setIsDrawing(true);
        setStartPos(pos);
        setCurrentPos(pos);
        setDrawnBoundingBox(null);
        setCapturedImageData(null);
         console.log('Drawing started at', pos);
    };

    const handleMouseMove = (event) => {
        if (!isDrawing || !canvasRef.current) return;
        const pos = getCanvasCoordinates(event);
        setCurrentPos(pos);
    };

    const handleMouseUp = (event) => {
        console.log('handleMouseUp called.', { isDrawing });
        if (!isDrawing || !canvasRef.current) return;
        setIsDrawing(false);
        const endPos = getCanvasCoordinates(event);

        const x = Math.min(startPos.x, endPos.x);
        const y = Math.min(startPos.y, endPos.y);
        const width = Math.abs(endPos.x - startPos.x);
        const height = Math.abs(endPos.y - startPos.y);

        if (width > 5 && height > 5) {
            setDrawnBoundingBox({ x, y, width, height });
            console.log('Bounding box drawn:', { x, y, width, height });
             requestAnimationFrame(drawFrame);
        } else {
            setDrawnBoundingBox(null);
             console.log('Drawn box too small, discarded.');
             requestAnimationFrame(drawFrame);
        }
         setStartPos({ x: 0, y: 0 });
         setCurrentPos({ x: 0, y: 0 });
    };

     const handleTouchStart = (event) => {
          console.log('handleTouchStart called.', { isStreamReady, drawnBoundingBox: !!drawnBoundingBox, touches: event.touches.length });
          if (!isStreamReady || drawnBoundingBox || event.touches.length !== 1 || !canvasRef.current) return;
          const touch = event.touches[0];
          const pos = getCanvasCoordinates(touch);
          setIsDrawing(true);
          setStartPos(pos);
          setCurrentPos(pos);
          setDrawnBoundingBox(null);
          setCapturedImageData(null);
          console.log('Touch drawing started at', pos);
          event.preventDefault();
     };

     const handleTouchMove = (event) => {
          if (!isDrawing || event.touches.length !== 1 || !canvasRef.current) return;
          const touch = event.touches[0];
          const pos = getCanvasCoordinates(touch);
          setCurrentPos(pos);
          event.preventDefault();
     };

     const handleTouchEnd = (event) => {
          console.log('handleTouchEnd called.', { isDrawing });
          if (!isDrawing || !canvasRef.current) return;
          setIsDrawing(false);
           const endPos = currentPos;

          const x = Math.min(startPos.x, endPos.x);
          const y = Math.min(startPos.y, endPos.y);
          const width = Math.abs(endPos.x - startPos.x);
          const height = Math.abs(endPos.y - startPos.y);

          if (width > 5 && height > 5) {
             setDrawnBoundingBox({ x, y, width, height });
             console.log('Bounding box drawn (touch):', { x, y, width, height });
             requestAnimationFrame(drawFrame);
          } else {
             setDrawnBoundingBox(null);
              console.log('Drawn box too small (touch), discarded.');
             requestAnimationFrame(drawFrame);
          }
           setStartPos({ x: 0, y: 0 });
           setCurrentPos({ x: 0, y: 0 });
     };


    // --- Capture and Reset ---
    const captureCroppedImage = useCallback(() => {
        console.log('captureCroppedImage clicked.');
        console.log('Capture prerequisites:', { drawnBoundingBox: !!drawnBoundingBox, videoRef: !!videoRef.current, canvasRef: !!canvasRef.current });

        if (!drawnBoundingBox || !videoRef.current || !canvasRef.current) {
            console.log('Cannot capture: Prerequisites not met.');
            setErrorMessage('Cannot capture: No selection box drawn or camera not ready.');
            return;
        }

        try {
             const tempCanvas = document.createElement('canvas');
             tempCanvas.width = videoRef.current.videoWidth;
             tempCanvas.height = videoRef.current.videoHeight;
             const tempContext = tempCanvas.getContext('2d');

            if (!tempContext) {
                 console.error("Could not get 2D context for temporary canvas.");
                 setErrorMessage("Internal error during image processing.");
                 return;
            }

             tempContext.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
             console.log('Drew video frame onto temporary canvas.');


             const displayRect = canvasRef.current.getBoundingClientRect();
            const scaleX = displayRect.width > 0 ? videoRef.current.videoWidth / displayRect.width : 1;
            const scaleY = displayRect.height > 0 ? videoRef.current.videoHeight / displayRect.height : 1;

            // --- Add detailed logging for scaling ---
            console.log('Video intrinsic dimensions:', { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight });
            console.log('Canvas display dimensions (getBoundingClientRect):', { width: displayRect.width, height: displayRect.height });
            console.log('Scaling factors:', { scaleX, scaleY });
            console.log('Drawn Bounding Box (display coords):', drawnBoundingBox);
            // --- End detailed logging ---


            const croppedX = drawnBoundingBox.x * scaleX;
            const croppedY = drawnBoundingBox.y * scaleY;
            const croppedWidth = drawnBoundingBox.width * scaleX;
            const croppedHeight = drawnBoundingBox.height * scaleY;

            console.log('Calculated cropped area (scaled to intrinsic video size):', { croppedX, croppedY, croppedWidth, croppedHeight });

             const croppedCanvas = document.createElement('canvas');
             croppedCanvas.width = croppedWidth;
             croppedCanvas.height = croppedHeight;
             const croppedContext = croppedCanvas.getContext('2d');

             if (!croppedContext) {
                  console.error("Could not get 2D context for cropped canvas.");
                  setErrorMessage("Internal error during image processing.");
                  return;
             }

             croppedContext.drawImage(
                tempCanvas, // Source canvas (video frame)
                croppedX,    // Source X
                croppedY,    // Source Y
                croppedWidth, // Source Width
                croppedHeight, // Source Height
                0,           // Destination X
                0,           // Destination Y
                croppedWidth, // Destination Width
                croppedHeight // Destination Height
             );
             console.log('Drew cropped area onto final cropped canvas.');


             const croppedImageDataUrl = croppedCanvas.toDataURL('image/png');

             setCapturedImageData(croppedImageDataUrl);
             console.log('Cropped image data URL generated and state set.');

        } catch (error) {
            console.error('Error capturing or cropping image:', error);
            setErrorMessage(`Error capturing image: ${error.message || error}`);
        }
    }, [drawnBoundingBox]);

    const resetCapture = useCallback(() => {
        console.log('Resetting capture.');
        setDrawnBoundingBox(null);
        setCapturedImageData(null);
        setIsDrawing(false);
        setStartPos({ x: 0, y: 0 });
        setCurrentPos({ x: 0, y: 0 });
        setErrorMessage('');
         requestAnimationFrame(drawFrame);
    }, [drawFrame]);


    // --- Button Handlers ---
    const handleCameraToggle = useCallback(() => {
        if (isCameraActive) {
            stopCamera();
        } else {
            setIsCameraActive(true);
            startCamera();
        }
    }, [isCameraActive, startCamera, stopCamera]);

    useEffect(() => {
         return () => {
             stopCamera();
         };
    }, [stopCamera]);

     useEffect(() => {
         return () => {
             if (animationFrameIdRef.current) {
                 cancelAnimationFrame(animationFrameIdRef.current);
                 animationFrameIdRef.current = null;
             }
         };
     }, []);


    return (
        <div>
            <button onClick={handleCameraToggle} className="button button-selected">
                {isCameraActive ? 'Close Camera' : 'Open Camera for Capture'}
            </button>

             {errorMessage && (
                 <div className="error-message">
                     {errorMessage}
                 </div>
             )}

            {/* Display video and canvas when camera is active */}
            {isCameraActive && (
                <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '10px auto', cursor: isStreamReady && !drawnBoundingBox && !isDrawing ? 'crosshair' : 'default' }}>
                     <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                         style={{ display: 'none' }}
                    />
                    <canvas
                        ref={canvasRef}
                        className="video"
                        style={{ display: isCameraActive ? 'block' : 'none' }} // Keep inline display control
                         onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                </div>
            )}

            {isCameraActive && isStreamReady && !errorMessage && (
                <div style={{ marginTop: '10px' }}>
                    {!drawnBoundingBox && !isDrawing && (
                         <p>Draw a box around the item to capture.</p>
                    )}

                    {isDrawing && (
                         <p>Release to finish drawing.</p>
                    )}

                    {drawnBoundingBox && !capturedImageData && (
                         <button onClick={captureCroppedImage} className="button button-capture">
                           Capture Selected Area
                         </button>
                    )}
                    {(drawnBoundingBox || capturedImageData) && (
                         <button onClick={resetCapture} className="button button-secondary" style={{ marginLeft: '10px' }}>
                           Redraw / Start Again
                         </button>
                    )}
                     {capturedImageData && onCapture && (
                         <button onClick={() => onCapture(capturedImageData)} className="button button-selected" style={{ marginLeft: '10px' }}>
                             Use This Image
                         </button>
                     )}
                      {capturedImageData && !onCapture && (
                         <p style={{ marginTop: '10px' }}>Image Captured. Provide an 'onCapture' prop to use it.</p>
                     )}
                </div>
            )}

                  {capturedImageData && (
                      <div style={{ marginTop: '20px', textAlign: 'center' }}>
                          <h3>Captured Seed Image:</h3>
                          <img src={capturedImageData} alt="Captured Jewelry" style={{ maxWidth: '200px', height: 'auto', border: '1px solid #ccc' }} />
                      </div>
                  )}

        </div>
    );
};

export default CameraCapture;


