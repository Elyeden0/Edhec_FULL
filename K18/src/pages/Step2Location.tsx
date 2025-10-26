import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { ArrowRight, ArrowLeft, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Step2Location = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [cityName, setCityName] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationMethod, setLocationMethod] = useState<"auto" | "manual" | null>(null);

  useEffect(() => {
    // Check if location already exists
    const locationData = localStorage.getItem('userLocation');
    if (locationData) {
      const { city } = JSON.parse(locationData);
      if (city) {
        setCityName(city);
        setLocationMethod("auto");
      }
    }
  }, []);

  const getCityName = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'User-Agent': 'K18HairAnalysis/1.0'
          }
        }
      );
      const data = await response.json();
      
      const city = data.address?.city || 
                   data.address?.town || 
                   data.address?.village || 
                   data.address?.municipality ||
                   data.address?.county ||
                   "Unknown location";
      
      return city;
    } catch (error) {
      console.error("Error getting city name:", error);
      return null;
    }
  };

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

  const requestAutoLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your city manually.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);
    setLocationMethod("auto");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const city = await getCityName(position.coords.latitude, position.coords.longitude);
          if (city) {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              city: city,
              timestamp: new Date().toISOString()
            };
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setCityName(city);
            toast({
              title: "Location Found!",
              description: `Set to ${city}`,
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Could not determine your city. Please enter it manually.",
            variant: "destructive"
          });
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMessage = "Location access denied.";
        if (error.code === 1) {
          errorMessage = "Please enable location in your browser settings.";
        } else if (error.code === 2) {
          errorMessage = "Location information unavailable.";
        } else if (error.code === 3) {
          errorMessage = "Location request timed out.";
        }
        
        toast({
          title: "Location Error",
          description: errorMessage + " You can enter your city manually below.",
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };

  const handleManualSubmit = async () => {
    if (!manualCity.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a city name.",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);
    setLocationMethod("manual");

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
      toast({
        title: "Location Set!",
        description: `Set to ${coords.city}`,
      });
    } else {
      toast({
        title: "City Not Found",
        description: "Could not find that city. Please try another name.",
        variant: "destructive"
      });
    }
    setIsLoadingLocation(false);
  };

  const handleNext = () => {
    if (!cityName) {
      toast({
        title: "Location Required",
        description: "Please set your location to get weather-aware recommendations.",
        variant: "destructive"
      });
      return;
    }

    navigate("/results");
  };

  const handleSkip = () => {
    toast({
      title: "Skipping Location",
      description: "You'll get general recommendations without weather context.",
    });
    navigate("/results");
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
          
          <h1 className="text-4xl font-bold mb-2">Where Are You Located?</h1>
          <p className="text-lg text-muted-foreground">
            Get weather-aware recommendations tailored to your climate
          </p>
        </div>

        {cityName ? (
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Location</p>
                    <p className="text-xl font-semibold">{cityName}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCityName("");
                    setLocationMethod(null);
                    localStorage.removeItem('userLocation');
                  }}
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Auto Location */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Automatic Detection</CardTitle>
                <CardDescription>
                  Use your device's location for quick setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={requestAutoLocation}
                  disabled={isLoadingLocation && locationMethod === "auto"}
                  className="w-full h-14"
                  size="lg"
                >
                  {isLoadingLocation && locationMethod === "auto" ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-5 w-5" />
                      Use My Current Location
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Manual Location */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>
                  Enter your city name if automatic detection doesn't work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city">City Name</Label>
                  <Input
                    id="city"
                    placeholder="e.g., New York, London, Tokyo"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleManualSubmit();
                      }
                    }}
                    className="h-12 text-lg"
                  />
                </div>
                <Button
                  onClick={handleManualSubmit}
                  disabled={isLoadingLocation && locationMethod === "manual"}
                  variant="outline"
                  className="w-full h-12"
                >
                  {isLoadingLocation && locationMethod === "manual" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding City...
                    </>
                  ) : (
                    "Set Location"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Why Location */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              🌦️ Why do we need your location?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Weather conditions like humidity, temperature, and precipitation significantly affect your hair. 
              By knowing your location, we can provide recommendations that work with your local climate, 
              not against it.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSkip}
            variant="outline"
            size="lg"
            className="flex-1 h-14 text-lg"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleNext}
            size="lg"
            className="flex-1 h-14 text-lg"
            disabled={!cityName}
          >
            See My Results
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step2Location;
