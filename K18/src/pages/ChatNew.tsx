import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, Upload, Loader2, MapPin, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HairAnalysisResult {
  hair_type: string;
  confidence: number;
  scores: Record<string, number>;
  reasoning?: string;
  characteristics?: string[];
  message: string;
}

interface WeatherData {
  temperature?: number;
  humidity?: number;
  condition: string;
  is_humid: boolean;
  is_dry: boolean;
  is_rainy: boolean;
}

interface ProductRecommendation {
  id: number;
  name: string;
  price: string;
  size: string;
  description: string;
  score: number;
  reasoning: string;
}

interface AnalysisResponse {
  success: boolean;
  hair_analysis: HairAnalysisResult;
  weather_data: WeatherData;
  recommendations: ProductRecommendation[];
  message: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cityName, setCityName] = useState<string | null>(null);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Load city name on mount
  useEffect(() => {
    const locationData = localStorage.getItem('userLocation');
    if (locationData) {
      const { city } = JSON.parse(locationData);
      if (city) {
        setCityName(city);
      }
    }
  }, []);

  const geocodeCity = async (cityName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'K18HairAnalysis/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
          city: cityName
        };
      }
      return null;
    } catch (error) {
      console.error("Error geocoding city:", error);
      return null;
    }
  };

  const handleManualLocationSubmit = async () => {
    if (!manualCity.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a city name",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);
    const coords = await geocodeCity(manualCity);
    
    if (coords) {
      const locationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        city: coords.city,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      setCityName(coords.city);
      setLocationDialogOpen(false);
      setManualCity("");
      toast({
        title: "Location updated",
        description: `Location set to ${coords.city}. Reanalyze your hair for updated recommendations.`,
      });
    } else {
      toast({
        title: "City not found",
        description: "Could not find that city. Please try another name.",
        variant: "destructive"
      });
    }
    setIsLoadingLocation(false);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Analyze image
      await analyzeHair(file);
    }
  };

  const startCamera = async () => {
    try {
      setCameraActive(true); // Set state first to show the video element
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play(); // Explicitly start playing
      }
    } catch (error) {
      console.error("Camera error:", error);
      setCameraActive(false); // Reset state on error
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Convert to blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Stop camera
            const stream = videoRef.current?.srcObject as MediaStream;
            stream?.getTracks().forEach(track => track.stop());
            setCameraActive(false);

            // Preview
            setImagePreview(canvas.toDataURL());

            // Analyze
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            await analyzeHair(file);
          }
        }, "image/jpeg");
      }
    }
  };

  const analyzeHair = async (file: File) => {
    setAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Get location data if available
      const locationData = localStorage.getItem("userLocation");
      if (locationData) {
        const { latitude, longitude } = JSON.parse(locationData);
        formData.append("latitude", latitude.toString());
        formData.append("longitude", longitude.toString());
      }
      
      // Add city name if available
      if (cityName) {
        formData.append("city", cityName);
      }

      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysisResult(data);

      toast({
        title: "Analysis Complete",
        description: `Hair type detected: ${data.hair_analysis.hair_type}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze image. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  const getHairTypeColor = (type: string) => {
    switch (type) {
      case "dry": return "text-orange-600";
      case "oily": return "text-blue-600";
      case "normal": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo />
          <div className="w-10" />
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Hair Analysis</h1>
            <p className="text-muted-foreground">
              Upload or capture a photo of your hair for personalized recommendations
            </p>
          </div>

          {/* Location Display */}
          {cityName && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Current Location: {cityName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocationDialogOpen(true)}
                    className="h-8 gap-2"
                  >
                    <Edit2 className="h-3 w-3" />
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Controls */}
          {!imagePreview && !cameraActive && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    variant="outline"
                    className="h-32 flex-col gap-2"
                  >
                    <Upload className="h-8 w-8" />
                    <span>Upload Photo</span>
                  </Button>
                  <Button
                    onClick={startCamera}
                    size="lg"
                    variant="outline"
                    className="h-32 flex-col gap-2"
                  >
                    <Camera className="h-8 w-8" />
                    <span>Take Photo</span>
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )}

          {/* Camera View */}
          {cameraActive && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full rounded-lg bg-black"
                  />
                  <div className="flex gap-2">
                    <Button onClick={capturePhoto} className="flex-1" size="lg">
                      <Camera className="mr-2 h-5 w-5" />
                      Capture Photo
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        const stream = videoRef.current?.srcObject as MediaStream;
                        stream?.getTracks().forEach(track => track.stop());
                        setCameraActive(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Preview & Analysis */}
          {imagePreview && (
            <Card>
              <CardContent className="pt-6">
                <img
                  src={imagePreview}
                  alt="Hair preview"
                  className="w-full rounded-lg mb-4"
                />
                {analyzing && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing your hair...</span>
                  </div>
                )}
                {!analyzing && (
                  <Button
                    onClick={() => {
                      setImagePreview(null);
                      setAnalysisResult(null);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Take Another Photo
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Hair Analysis Results</CardTitle>
                  <CardDescription>Powered by AI Vision Analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Hair Type</p>
                    <p className={`text-2xl font-bold capitalize ${getHairTypeColor(analysisResult.hair_analysis.hair_type)}`}>
                      {analysisResult.hair_analysis.hair_type}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Confidence: {(analysisResult.hair_analysis.confidence * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* AI Reasoning */}
                  {analysisResult.hair_analysis.reasoning && (
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <p className="text-sm font-medium mb-2">AI Analysis</p>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.hair_analysis.reasoning}
                      </p>
                    </div>
                  )}

                  {/* Hair Characteristics */}
                  {analysisResult.hair_analysis.characteristics && analysisResult.hair_analysis.characteristics.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Observed Traits</p>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.hair_analysis.characteristics.map((trait, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysisResult.weather_data.temperature && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Current Weather</p>
                      <div className="flex gap-4 text-sm">
                        <span>🌡️ {analysisResult.weather_data.temperature}°C</span>
                        <span>💧 {analysisResult.weather_data.humidity}%</span>
                        <span className="capitalize">{analysisResult.weather_data.condition.replace("_", " ")}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Recommended Products</h2>
                {analysisResult.recommendations.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <CardDescription>{product.size}</CardDescription>
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {product.price}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {product.description}
                      </p>
                      <div className="bg-primary/5 p-3 rounded-lg">
                        <p className="text-sm font-medium text-primary">
                          Why we recommend this:
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.reasoning}
                        </p>
                      </div>
                      <Button className="w-full" size="lg">
                        View Product
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Manual Location Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Your Location</DialogTitle>
            <DialogDescription>
              Enter your city name for accurate weather-based hair analysis
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City Name</Label>
              <Input
                id="city"
                placeholder="e.g., Paris, New York, Tokyo"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleManualLocationSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setLocationDialogOpen(false);
                setManualCity("");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleManualLocationSubmit}
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? "Finding..." : "Update Location"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
