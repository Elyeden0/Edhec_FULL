import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { ArrowRight, Camera, MapPin, Package, Droplets, Lock, Sparkles } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Professional Hair Analysis
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
          Get personalized hair care recommendations powered by AI. 
          Our advanced system analyzes your hair type and environmental factors to suggest the perfect K18 products.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <p>
            Powered by <span className="font-semibold text-purple-600">Google Gemini</span>
            {" "}• Custom LLM in development
          </p>
        </div>
      </div>        {/* How It Works */}
      {/* Steps */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="border-2 hover:border-purple-500 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Step 1: Location</CardTitle>
            <CardDescription>
              Share your location for weather-aware recommendations
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-purple-500 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Step 2: Photo</CardTitle>
            <CardDescription>
              Take or upload a clear photo of your hair
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-purple-500 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Step 3: Results</CardTitle>
            <CardDescription>
              Get your personalized analysis and product recommendations
            </CardDescription>
          </CardHeader>
        </Card>
      </div>        {/* CTA */}
      {/* RGPD Notice */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
        <Lock className="w-4 h-4 text-green-600" />
        <p>
          <span className="font-semibold text-green-600">GDPR Compliant</span>
          {" "}• Your data is protected • 
          <a 
            href="/rgpd-policy" 
            className="text-purple-600 hover:underline ml-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
          onClick={() => navigate("/step1")}
        >
          Start Your Hair Analysis
        </Button>
      </div>        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-2">🧬</div>
            <h3 className="font-semibold mb-2">Advanced AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Powered by Google Gemini 2.0 for accurate hair type detection
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🌦️</div>
            <h3 className="font-semibold mb-2">Weather-Aware</h3>
            <p className="text-sm text-muted-foreground">
              Recommendations adapt to your local climate conditions
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">💆</div>
            <h3 className="font-semibold mb-2">Personalized Care</h3>
            <p className="text-sm text-muted-foreground">
              Tailored K18 product recommendations for your unique hair
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
