import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Step1Location from "./pages/Step1Location";
import Step2Photo from "./pages/Step2Photo";
import Results from "./pages/Results";
import Products from "./pages/Products";
import RgpdPolicy from "./pages/RgpdPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/step1" element={<Step1Location />} />
          <Route path="/step2" element={<Step2Photo />} />
          <Route path="/results" element={<Results />} />
          <Route path="/products" element={<Products />} />
          <Route path="/rgpd-policy" element={<RgpdPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
