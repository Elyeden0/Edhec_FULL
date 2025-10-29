import { useState, useEffect } from "react";
import { ArrowLeft, ShoppingBag, ExternalLink, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";

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
  recommendations: ProductRecommendation[];
  hair_analysis?: {
    hair_type: string;
  };
}

const Products = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    // Get analysis results from session storage
    const storedData = sessionStorage.getItem('analysisResult');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setAnalysisData(data);
      } catch (error) {
        console.error("Error parsing analysis data:", error);
      }
    }
  }, []);

  const startOver = () => {
    sessionStorage.clear();
    navigate("/");
  };

  if (!analysisData || !analysisData.recommendations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
        <header className="p-6">
          <Logo />
        </header>
        <div className="container max-w-2xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">No Analysis Found</h1>
          <p className="text-muted-foreground mb-8">
            Please complete a hair analysis first to see personalized product recommendations.
          </p>
          <Button onClick={() => navigate("/")} size="lg">
            Start Hair Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-white">
      <header className="p-6">
        <Logo />
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8 pb-20">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/results")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Your Recommended Products</h1>
          <p className="text-lg text-muted-foreground">
            Personalized K18 products tailored for your{" "}
            <span className="font-semibold text-primary">
              {analysisData.hair_analysis?.hair_type || "hair type"}
            </span>{" "}
            hair
          </p>
        </div>

        <div className="space-y-6">
          {analysisData.recommendations.map((product, idx) => (
            <Card 
              key={product.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow ${
                idx === 0 ? "border-2 border-primary" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{product.name}</CardTitle>
                      {idx === 0 && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                          Best Match
                        </Badge>
                      )}
                      {idx === 1 && (
                        <Badge variant="outline" className="border-purple-400 text-purple-700">
                          Great Choice
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">
                      {product.size} • {product.price}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {(product.score * 100).toFixed(0)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Match Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Description */}
                <div>
                  <p className="text-base leading-relaxed">{product.description}</p>
                </div>

                {/* Match Score Bar */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Compatibility</span>
                    <span className="text-sm text-primary font-semibold">
                      {(product.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-2 transition-all"
                      style={{ width: `${product.score * 100}%` }}
                    />
                  </div>
                </div>

                {/* Reasoning */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900 leading-relaxed">
                    <strong className="font-semibold">Why this product is perfect for you:</strong>
                    <br />
                    {product.reasoning}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
                    size="lg"
                    asChild
                  >
                        <button
                          onClick={() => {
                            // Save pending purchase so reminder page can redirect after setting reminder
                            const pending = {
                              url: `https://k18hair.com/products/${product.id}`,
                              productId: product.id,
                            };
                            sessionStorage.setItem('pendingPurchase', JSON.stringify(pending));
                            navigate('/products/reminder');
                          }}
                          className="flex items-center justify-center w-full"
                        >
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Buy Now
                        </button>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    asChild
                  >
                    <a 
                      href={`https://k18hair.com/products/${product.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Learn More
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4">
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
            onClick={() => navigate("/results")}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            View Analysis Results
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">About K18</h3>
          <p className="text-sm text-muted-foreground">
            K18 is a patented biotech haircare line that works at the molecular level to repair damage 
            from bleach, color, chemical services and heat. The K18PEPTIDE™ is a breakthrough molecule 
            that reconnects broken keratin chains, reversing hair damage in just 4 minutes.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Products;
