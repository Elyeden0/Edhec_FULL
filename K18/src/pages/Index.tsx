import { MessageCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChatClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem('userLocation', JSON.stringify(locationData));
          toast({
            title: "Location captured",
            description: "Your location has been saved for better analysis",
          });
          navigate("/chat");
        },
        (error) => {
          console.log("Geolocation error:", error);
          toast({
            title: "Continuing without location",
            description: "Location access was not granted. You can still use the chat.",
          });
          // Navigate to chat even without location
          navigate("/chat");
        }
      );
    } else {
      toast({
        title: "Continuing without location",
        description: "Your browser doesn't support geolocation, but you can still use the chat.",
      });
      // Navigate to chat even without geolocation support
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Floating product bottles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Pink mask bottle - top right */}
        <div className="absolute top-10 right-10 w-32 h-40 rounded-full bg-gradient-to-br from-pink-300 to-primary opacity-20 blur-2xl transform rotate-12 animate-float-slow"></div>

        {/* Purple shampoo bottle - top left */}
        <div className="absolute top-20 left-5 w-28 h-36 rounded-full bg-gradient-to-br from-purple-300 to-secondary opacity-25 blur-2xl transform -rotate-12 animate-float-medium"></div>

        {/* White conditioner - middle right */}
        <div className="absolute top-1/3 right-5 w-24 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 opacity-30 blur-2xl transform rotate-6 animate-float-fast"></div>

        {/* Lavender bottle - middle left */}
        <div className="absolute top-1/2 left-10 w-36 h-44 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-20 blur-2xl transform -rotate-6 animate-float-slow" style={{ animationDelay: '1s' }}></div>

        {/* Pink oil bottle - bottom right */}
        <div className="absolute bottom-32 right-16 w-20 h-28 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 opacity-25 blur-2xl transform rotate-12 animate-float-medium" style={{ animationDelay: '2s' }}></div>

        {/* Purple mask - bottom left */}
        <div className="absolute bottom-20 left-8 w-32 h-40 rounded-full bg-gradient-to-br from-purple-400 to-secondary opacity-20 blur-2xl transform -rotate-12 animate-float-fast" style={{ animationDelay: '0.5s' }}></div>

        {/* White bottle - center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-48 rounded-full bg-gradient-to-br from-white to-gray-100 opacity-15 blur-3xl animate-float-slow" style={{ animationDelay: '1.5s' }}></div>

        {/* Hot pink accent - top center */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-24 h-32 rounded-full bg-gradient-to-br from-primary to-pink-500 opacity-20 blur-2xl animate-float-medium" style={{ animationDelay: '3s' }}></div>

        {/* Middle center - bright pink */}
        <div className="absolute top-1/2 left-1/3 w-28 h-36 rounded-full bg-gradient-to-br from-pink-400 to-primary opacity-25 blur-2xl transform rotate-45 animate-float-fast" style={{ animationDelay: '2.5s' }}></div>

        {/* Middle center right - purple */}
        <div className="absolute top-[45%] right-1/3 w-32 h-40 rounded-full bg-gradient-to-br from-purple-300 to-secondary opacity-22 blur-2xl transform -rotate-20 animate-float-slow" style={{ animationDelay: '1.2s' }}></div>

        {/* Center left - lavender */}
        <div className="absolute top-[55%] left-1/4 w-26 h-34 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 opacity-20 blur-2xl transform rotate-15 animate-float-medium" style={{ animationDelay: '0.8s' }}></div>

        {/* Bottom center - hot pink */}
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-30 h-38 rounded-full bg-gradient-to-br from-primary to-pink-600 opacity-23 blur-2xl rotate-30 animate-float-fast" style={{ animationDelay: '2.8s' }}></div>

        {/* Mid-right purple accent */}
        <div className="absolute top-[40%] right-[20%] w-22 h-30 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 opacity-25 blur-2xl transform -rotate-25 animate-float-slow" style={{ animationDelay: '1.8s' }}></div>
      </div>

      <header className="p-6 relative z-10 flex justify-between items-start">
        <Logo className="text-foreground" />
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-2"
        >
          <a href="https://k18hair.com" target="_blank" rel="noopener noreferrer">
            <span className="text-sm">Visit Website</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 relative z-10">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Welcome to K18 AI hair analyser
            </h1>
            <p className="text-lg text-muted-foreground">
              Biomimetic haircare powered by breakthrough science
            </p>
          </div>

          <div className="pt-8 space-y-4">
            <Button
              onClick={handleChatClick}
              size="lg"
              className="w-full h-20 text-lg font-semibold shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_50px_-5px_hsl(var(--primary)/0.5)] transition-all"
            >
              <MessageCircle className="mr-3 h-6 w-6" />
              Chat with K18
            </Button>
          </div>

          <div className="pt-12 space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-wider font-semibold">Biomimetic Hairscience</span>
            </div>
            <div className="flex justify-center">
              <Button
                variant="link"
                size="sm"
                asChild
                className="text-primary"
              >
                <a href="https://k18hair.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3" />
                  <span className="text-xs">Learn more at k18hair.com</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
