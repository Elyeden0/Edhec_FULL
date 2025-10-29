import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { ArrowLeft, Shield, Lock, Eye, Trash2, Database } from "lucide-react";

const GdprPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Privacy Policy & GDPR Compliance
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: October 26, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              <CardTitle>Your Privacy Matters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              K18 Hair Analysis is committed to protecting your personal data and respecting your privacy. 
              This policy explains how we collect, use, and protect your information in compliance with the 
              General Data Protection Regulation (GDPR).
            </p>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-600" />
              <CardTitle>Data We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Hair Photo</h3>
              <p className="text-sm text-muted-foreground">
                Your uploaded or captured photo is temporarily stored in your browser's session storage 
                for analysis purposes only. Photos are sent to our AI service (Google Gemini) for hair 
                type detection and are not permanently stored on our servers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Location Data</h3>
              <p className="text-sm text-muted-foreground">
                If you choose to share your location, we collect your city and coordinates to provide 
                weather-aware product recommendations. This data is stored locally in your browser and 
                can be cleared at any time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Analysis Results</h3>
              <p className="text-sm text-muted-foreground">
                Your hair analysis results are generated in real-time and stored only in your browser's 
                session. We do not store these results on our servers.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Data */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Eye className="w-6 h-6 text-purple-600" />
              <CardTitle>How We Use Your Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Hair Analysis:</strong> Your photo is analyzed by AI to determine your hair type 
                and condition, enabling personalized product recommendations.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Weather Context:</strong> Your location is used to fetch current weather conditions, 
                helping us recommend products suitable for your climate.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Service Improvement:</strong> We may use anonymized, aggregated data to improve 
                our AI models and service quality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-green-600" />
              <CardTitle>How We Protect Your Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Local Storage:</strong> Your photos and analysis results are stored only in your 
                browser's session storage and automatically cleared when you close the browser.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Encrypted Transmission:</strong> All data sent to our servers is encrypted using 
                industry-standard HTTPS protocols.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>No Permanent Storage:</strong> We do not store your photos or personal information 
                on our servers. Analysis is performed in real-time and results are returned immediately.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Third-Party AI:</strong> Photos are processed by Google Gemini API. Their privacy 
                policy applies to data processed through their service. Google does not retain your photos 
                after processing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trash2 className="w-6 h-6 text-red-600" />
              <CardTitle>Your GDPR Rights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Right to Access:</strong> You can view all data stored in your browser at any time.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Right to Delete:</strong> You can clear all your data by clearing your browser's 
                session storage or closing your browser.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Right to Opt-Out:</strong> Location sharing is entirely optional. You can skip 
                location sharing and still receive general recommendations.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-2" />
              <p className="text-sm text-muted-foreground flex-1">
                <strong>Right to Object:</strong> You have the right to stop using our service at any time, 
                and all session data will be automatically cleared.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cookies & Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We use minimal browser storage (sessionStorage and localStorage) to maintain your data 
              during your session. We do not use tracking cookies or third-party analytics. Your data 
              is never shared with advertisers or marketing companies.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions about our privacy practices or wish to exercise your GDPR rights, 
              please contact us:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-mono">
                Email: privacy@k18hairanalysis.com<br />
                Data Protection Officer: dpo@k18hairanalysis.com
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Note:</strong> This service is currently in development. Our custom LLM is being trained 
            to replace Google Gemini, which will further enhance data privacy by keeping all processing local.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GdprPolicy;
