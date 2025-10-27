import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { ArrowRight, ArrowLeft, Camera, Upload, X, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Step2Photo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const checkCameraPermissions = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("MediaDevices API not supported");
        toast({
          title: "Camera Not Supported",
          description: "Your browser doesn't support camera access. Please use Chrome, Firefox, or Edge.",
          variant: "destructive"
        });
        return false;
      }

      console.log("MediaDevices API is supported");
      
      // List available devices
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        console.log("Available video devices:", videoDevices);
        console.log("Number of cameras found:", videoDevices.length);
        
        if (videoDevices.length === 0) {
          console.error("No video input devices found");
          toast({
            title: "No Camera Found",
            description: "No camera detected. Please connect a camera and try again.",
            variant: "destructive"
          });
          return false;
        }
        
        console.log("✓ Found", videoDevices.length, "camera(s)");
      } catch (e) {
        console.log("Could not enumerate devices (this is OK):", e);
      }

      return true;
    } catch (error) {
      console.error("Permission check error:", error);
      return true; // Try anyway
    }
  };

  const startCamera = async () => {
    console.log("=== STARTING CAMERA ===");
    
    try {
      setCameraLoading(true);
      
      // Check permissions first
      console.log("Step 1: Checking camera availability...");
      const canUseCamera = await checkCameraPermissions();
      if (!canUseCamera) {
        console.log("Camera check failed, aborting");
        setCameraLoading(false);
        return;
      }

      console.log("Step 2: Setting camera active state...");
      setCameraActive(true);
      setImagePreview(null);
      
      // Use simplest possible constraints
      const constraints = { 
        video: true,
        audio: false
      };

      console.log("Step 3: Requesting camera access...");
      console.log("Constraints:", constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("Step 4: Camera stream obtained!");
      console.log("Stream active:", stream.active);
      console.log("Stream tracks:", stream.getTracks().map(t => ({
        kind: t.kind,
        label: t.label,
        enabled: t.enabled,
        readyState: t.readyState
      })));
      
      if (videoRef.current) {
        console.log("Step 5: Attaching stream to video element...");
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.volume = 0;
        
        // Try to play immediately
        console.log("Step 6: Attempting to play video...");
        try {
          await videoRef.current.play();
          console.log("SUCCESS! Video is playing!");
          setCameraLoading(false);
          toast({
            title: "Camera Ready",
            description: "Position your hair and capture the photo.",
          });
        } catch (playError) {
          console.warn("Could not play immediately, waiting for metadata:", playError);
          
          // Fallback: wait for metadata
          videoRef.current.onloadedmetadata = async () => {
            console.log("Metadata loaded, trying to play now...");
            try {
              await videoRef.current!.play();
              console.log("SUCCESS! Video playing after metadata!");
              setCameraLoading(false);
              toast({
                title: "Camera Ready",
                description: "Position your hair and capture the photo.",
              });
            } catch (err) {
              console.error("Failed to play after metadata:", err);
              setCameraLoading(false);
              toast({
                title: "Playback Error",
                description: "Camera connected but video won't play. Try refreshing the page.",
                variant: "destructive"
              });
            }
          };
        }
      }
    } catch (error: any) {
      console.error("=== CAMERA ERROR ===");
      console.error("Error type:", error.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);
      
      setCameraActive(false);
      setCameraLoading(false);
      
      let errorTitle = "Camera Error";
      let errorMessage = "Unable to access camera.";
      
      // Specific error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorTitle = "Permission Denied";
        errorMessage = "You denied camera access. Click the camera icon in the address bar to allow access.";
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorTitle = "No Camera Found";
        errorMessage = "No camera detected. Please connect a camera and refresh the page.";
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorTitle = "Camera In Use";
        errorMessage = "Camera is being used by another application. Close other apps (Zoom, Skype, etc.) and try again.";
      } else if (error.name === 'OverconstrainedError') {
        errorTitle = "Camera Incompatible";
        errorMessage = "Your camera doesn't support the requested settings.";
      } else if (error.name === 'SecurityError') {
        errorTitle = "Security Error";
        errorMessage = "Camera access blocked. Make sure you're using HTTPS or localhost.";
      } else if (error.name === 'TypeError') {
        errorTitle = "Browser Not Compatible";
        errorMessage = "Your browser doesn't support camera access. Please use Chrome, Firefox, or Edge.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage + " You can upload a photo instead.",
        variant: "destructive",
        duration: 10000
      });
    }
  };

  const switchCamera = async () => {
    console.log("Switching camera from", facingMode, "to", facingMode === "user" ? "environment" : "user");
    stopCamera();
    
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    
    // Restart camera with new facing mode after a short delay
    setTimeout(async () => {
      try {
        setCameraLoading(true);
        setCameraActive(true);
        
        const constraints = { 
          video: { 
            facingMode: newMode
          },
          audio: false
        };

        console.log("Requesting camera with new facingMode:", constraints);
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          
          try {
            await videoRef.current.play();
            console.log("New camera is playing!");
            setCameraLoading(false);
            toast({
              title: "Camera Switched",
              description: `Using ${newMode === "user" ? "front" : "back"} camera`,
            });
          } catch (playErr) {
            console.error("Play error:", playErr);
            setCameraLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Switch camera error:", error);
        setCameraActive(false);
        setCameraLoading(false);
        toast({
          title: "Error",
          description: "Could not switch camera. Your device may only have one camera.",
          variant: "destructive"
        });
      }
    }, 300);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setImageFile(file);
            setImagePreview(canvas.toDataURL('image/jpeg'));
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleNext = () => {
    if (!imageFile) {
      toast({
        title: "Photo Required",
        description: "Please take or upload a photo of your hair to continue.",
        variant: "destructive"
      });
      return;
    }

    // Store image for later use
    const reader = new FileReader();
    reader.onload = () => {
      sessionStorage.setItem('hairPhoto', reader.result as string);
      sessionStorage.setItem('hairPhotoFile', imageFile.name);
      navigate("/results");
    };
    reader.readAsDataURL(imageFile);
  };

  const removePhoto = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-primary">Step 2</span>
          <span>/</span>
          <span>3</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/step1")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Let's See Your Hair</h1>
          <p className="text-lg text-muted-foreground">
            Take or upload a clear photo of your hair for AI analysis
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Hair Photo</CardTitle>
            <CardDescription>
              For best results, take a photo in good lighting with your hair clearly visible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Camera View */}
            {cameraActive && (
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full rounded-lg bg-black"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={capturePhoto} className="flex-1" size="lg">
                    <Camera className="mr-2 h-5 w-5" />
                    Capture Photo
                  </Button>
                  <Button onClick={switchCamera} variant="outline" size="lg" title="Switch camera">
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                  <Button onClick={stopCamera} variant="outline" size="lg">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && !cameraActive && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Hair preview"
                  className="w-full rounded-lg"
                />
                <Button
                  onClick={removePhoto}
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Upload Options */}
            {!imagePreview && !cameraActive && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <strong>📷 Camera Option:</strong> If your device has a camera, click "Take Photo" below and allow access when prompted.
                  <br />
                  <strong>� No Camera?</strong> No problem! Use "Upload Photo" to select an image from your device.
                </div>
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="w-full h-16 text-lg"
                  disabled={cameraLoading}
                >
                  {cameraLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Activating camera...
                    </>
                  ) : (
                    <>
                      <Camera className="mr-2 h-5 w-5" />
                      Take Photo
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-16 text-lg"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Photo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              💡 Tips for Best Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>✓ Use natural lighting or bright indoor lighting</li>
              <li>✓ Show your hair clearly from front or side</li>
              <li>✓ Avoid filters or heavy editing</li>
              <li>✓ Make sure your hair is the main focus</li>
            </ul>
          </CardContent>
        </Card>

        {/* Camera Troubleshooting */}
        {!imageFile && (
          <Card className="mt-4 bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                🔧 Camera Not Working?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>1. Check that you allowed camera access in your browser</li>
                <li>2. Make sure no other app is using the camera</li>
                <li>3. Try refreshing the page (F5)</li>
                <li>4. If issues persist, use "Upload Photo" instead</li>
                <li>5. Open browser console (F12) to see detailed error messages</li>
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Next Button */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleNext}
            size="lg"
            className="flex-1 h-14 text-lg"
            disabled={!imageFile}
          >
            Continue to Results
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Photo;
