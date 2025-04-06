
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PlantDetails from "./pages/PlantDetails";
import Reminders from "./pages/Reminders";
import PlantId from "./pages/PlantId";
import PlantDisease from "./pages/PlantDisease";
import Onboarding from "./pages/Onboarding";
import Garden from "./pages/Garden";
import Community from "./pages/Community";
import GreenAI from "./pages/GreenAI";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/plants/:id" element={<PlantDetails />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/plant-id" element={<PlantId />} />
          <Route path="/plant-disease" element={<PlantDisease />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/community" element={<Community />} />
          <Route path="/green-ai" element={<GreenAI />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
