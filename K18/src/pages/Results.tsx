import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2, MapPin, ThermometerSun, Droplets, RotateCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  city?: string;
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

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    performAnalysis();
  }, []);

  const performAnalysis = async () => {
    try {
      // Get stored data
      const photoData = sessionStorage.getItem('hairPhoto');
      const locationData = localStorage.getItem('userLocation');

      if (!photoData) {
        toast({
          title: "No Photo Found",
          description: "Please start from the beginning.",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      // Convert base64 to blob
      const base64Response = await fetch(photoData);
      const blob = await base64Response.blob();
      const file = new File([blob], "hair-photo.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("image", file);

      // Add location if available
      if (locationData) {
        const { latitude, longitude, city } = JSON.parse(locationData);
        if (latitude && longitude) {
          formData.append("latitude", latitude.toString());
          formData.append("longitude", longitude.toString());
        }
        if (city) {
          formData.append("city", city);
        }
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

    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your hair. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const startOver = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Analyzing Your Hair...</h2>
                <p className="text-muted-foreground">
                  Our AI is examining your photo and considering weather conditions
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-lg mb-4">Unable to load results</p>
            <Button onClick={startOver}>Start Over</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hairTypeColor = {
    dry: "bg-yellow-100 text-yellow-800 border-yellow-300",
    normal: "bg-green-100 text-green-800 border-green-300",
    oily: "bg-blue-100 text-blue-800 border-blue-300",
  };

  const getHairTypeDisplay = (hairType: string) => {
    if (hairType === "dry") return "TOO DRY";
    if (hairType === "oily") return "TOO OILY";
    return hairType.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Hair Analysis Results</h1>
          <p className="text-lg text-muted-foreground">
            Personalized insights and recommendations just for you
          </p>
        </div>

        <div className="space-y-6">
          {/* Hair Type Result */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Your Hair Type</CardTitle>
                  <CardDescription>Based on AI analysis of your photo</CardDescription>
                </div>
                <Badge className={`text-lg px-4 py-2 ${hairTypeColor[analysisResult.hair_analysis.hair_type]}`}>
                  {getHairTypeDisplay(analysisResult.hair_analysis.hair_type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Confidence</span>
                  <span className="text-primary font-semibold">
                    {(analysisResult.hair_analysis.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary rounded-full h-3 transition-all"
                    style={{ width: `${analysisResult.hair_analysis.confidence * 100}%` }}
                  />
                </div>
              </div>

              {analysisResult.hair_analysis.reasoning && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Analysis:</strong> {analysisResult.hair_analysis.reasoning}
                  </p>
                </div>
              )}

              {analysisResult.hair_analysis.characteristics && (
                <div>
                  <p className="font-medium mb-2">Key Characteristics:</p>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.hair_analysis.characteristics.map((char, idx) => (
                      <Badge key={idx} variant="outline">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weather Context */}
          {analysisResult.weather_data.temperature && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Weather Context
                </CardTitle>
                <CardDescription>Current conditions affecting your hair</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {analysisResult.weather_data.city && (
                    <div className="text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-semibold">{analysisResult.weather_data.city}</p>
                    </div>
                  )}
                  <div className="text-center">
                    <ThermometerSun className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <p className="text-sm text-muted-foreground">Temperature</p>
                    <p className="font-semibold">{analysisResult.weather_data.temperature}°C</p>
                  </div>
                  <div className="text-center">
                    <Droplets className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{analysisResult.weather_data.humidity}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <Button
              onClick={startOver}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Start New Analysis
            </Button>
            <Button
              onClick={() => {
                // Store analysis results for the products page
                sessionStorage.setItem('analysisResult', JSON.stringify(analysisResult));
                navigate("/products");
              }}
              size="lg"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              View Recommended Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
