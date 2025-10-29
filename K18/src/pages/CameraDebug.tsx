import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const CameraDebug = () => {
  const [status, setStatus] = useState<string>("Ready to test");
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const checkCamera = async () => {
    setLogs([]);
    setLoading(true);
    
  addLog("🔍 Checking MediaDevices API availability...");
    
    if (!navigator.mediaDevices) {
      setStatus("❌ MediaDevices API not available");
      addLog("❌ navigator.mediaDevices is missing");
      setLoading(false);
      return;
    }
    
  addLog("✅ MediaDevices API available");
    
    if (!navigator.mediaDevices.getUserMedia) {
      setStatus("❌ getUserMedia not supported");
      addLog("❌ navigator.mediaDevices.getUserMedia is missing");
      setLoading(false);
      return;
    }
    
  addLog("✅ getUserMedia available");
  addLog("🔍 Enumerating devices...");
    
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
  addLog(`📹 Total devices: ${devices.length}`);
      
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
  addLog(`📹 Video cameras: ${videoDevices.length}`);
      
      if (videoDevices.length === 0) {
        setStatus("❌ No camera detected");
        addLog("❌ No videoinput devices found");
        setLoading(false);
        return;
      }
      
      videoDevices.forEach((device, i) => {
        addLog(`  Camera ${i + 1}: ${device.label || 'Unnamed'}`);
        addLog(`    ID: ${device.deviceId.substring(0, 20)}...`);
      });
      
      setStatus(`✅ ${videoDevices.length} camera(s) detected`);
      
    } catch (error: any) {
      setStatus("⚠️ Enumeration error");
      addLog(`❌ Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testCamera = async () => {
    setLogs([]);
    setLoading(true);
    
  addLog("🎥 Requesting camera access...");
    
    try {
      const constraints = { video: true };
  addLog(`📋 Constraints: ${JSON.stringify(constraints)}`);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
  addLog("✅ Stream obtained!");
      
      const tracks = stream.getVideoTracks();
  addLog(`📹 Video tracks: ${tracks.length}`);
      
      tracks.forEach((track, i) => {
  addLog(`  Track ${i + 1}: ${track.label}`);
  addLog(`    State: ${track.readyState}`);
  addLog(`    Enabled: ${track.enabled}`);
        
        const settings = track.getSettings();
        addLog(`    Resolution: ${settings.width}x${settings.height}`);
        addLog(`    FrameRate: ${settings.frameRate}`);
      });
      
      if (videoRef.current) {
  addLog("📺 Attaching to video element...");
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        
        try {
          await videoRef.current.play();
          addLog("✅ Video playing!");
          setCameraActive(true);
          setStatus("✅ Camera is working!");
        } catch (playError: any) {
          addLog(`❌ Play error: ${playError.message}`);
          setStatus(`❌ Play error: ${playError.message}`);
        }
      }
      
    } catch (error: any) {
      addLog(`❌ ERROR: ${error.name}`);
      addLog(`   Message: ${error.message}`);
      setStatus(`❌ ${error.name}: ${error.message}`);

      let solution = "";
      switch(error.name) {
        case 'NotAllowedError':
          solution = "Access was denied. Click the camera icon in the address bar to allow access.";
          break;
        case 'NotFoundError':
          solution = "No camera found. Please ensure a camera is connected.";
          break;
        case 'NotReadableError':
          solution = "Camera is already in use by another application.";
          break;
        case 'SecurityError':
          solution = "Security error. Use HTTPS or localhost.";
          break;
      }

      if (solution) {
        addLog(`💡 Tip: ${solution}`);
      }
    }
    
    setLoading(false);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
  addLog(`🛑 Stopping: ${track.label}`);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setStatus("Camera stopped");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🔧 Camera Diagnostics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status */}
            <div className={`p-4 rounded-lg border-2 ${
              status.includes('✅') ? 'bg-green-50 border-green-200' :
              status.includes('❌') ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <p className="font-semibold">{status}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={checkCamera} disabled={loading} variant="outline">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
                Check Availability
              </Button>
              
              <Button onClick={testCamera} disabled={loading || cameraActive}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                Test Camera
              </Button>
              
              {cameraActive && (
                <Button onClick={stopCamera} variant="destructive">
                  Stop
                </Button>
              )}
            </div>

            {/* Video */}
            {cameraActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg bg-black"
                />
              </div>
            )}

            {/* Logs */}
            {logs.length > 0 && (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))}
              </div>
            )}

            {/* Browser Info */}
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Browser:</strong> {navigator.userAgent}<br />
                  <strong>URL:</strong> {window.location.href}<br />
                  <strong>Protocol:</strong> {window.location.protocol}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
                <p><strong>1.</strong> Click "Check Availability" to see if any cameras are detected</p>
            <p><strong>2.</strong> If cameras are found, click "Test Camera"</p>
            <p><strong>3.</strong> Allow access when your browser prompts you</p>
            <p><strong>4.</strong> The video should appear</p>
            <p className="text-muted-foreground pt-2">💡 Check the logs below for technical details</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CameraDebug;
