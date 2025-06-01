import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function PhotoCapture() {
  const [photo, setPhoto] = useState<string|null>(null);
  const [stream, setStream] = useState<MediaStream|null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  };

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    setPhoto(canvas.toDataURL('image/png'));
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  return (
    <div className="p-4 border rounded">
      {!stream && <Button onClick={startCamera}>Start Camera</Button>}
      {stream && <>
        <video ref={videoRef} autoPlay style={{ width: 320, height: 240 }} />
        <Button onClick={capture}>Capture Photo</Button>
      </>}
      {photo && <div className="mt-2"><img src={photo} alt="Captured" style={{ maxWidth: 320 }} /></div>}
    </div>
  );
} 