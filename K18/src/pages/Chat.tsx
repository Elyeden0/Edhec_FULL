import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Chat = () => {
  const navigate = useNavigate();

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

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]">
            <span className="text-3xl">💬</span>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">Chatbot Coming Soon</h1>
            <p className="text-muted-foreground text-lg">
              We're building an intelligent K18 assistant to help you with product recommendations, 
              hair care tips, and more.
            </p>
          </div>
          <div className="pt-4">
            <Button 
              onClick={() => navigate("/")} 
              variant="outline"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
