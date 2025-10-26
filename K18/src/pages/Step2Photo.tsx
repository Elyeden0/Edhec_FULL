import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { ArrowRight, ArrowLeft, Camera, Upload, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Step2Photo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
        setCameraActive(true);
        setImagePreview(null);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please upload a photo instead.",
        variant: "destructive"
      });
    }
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
                  className="w-full rounded-lg"
                  autoPlay
                  playsInline
                  muted
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={capturePhoto} className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Photo
                  </Button>
                  <Button onClick={stopCamera} variant="outline">
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
                <Button
                  onClick={startCamera}
                  variant="outline"
                  className="w-full h-16 text-lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo with Camera
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
                  Upload from Gallery
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
