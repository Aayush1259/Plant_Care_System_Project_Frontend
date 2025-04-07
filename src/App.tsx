
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/plants/:id" element={<PlantDetails />} />
            <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
            <Route path="/plant-id" element={<PlantId />} />
            <Route path="/plant-disease" element={<PlantDisease />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/garden" element={<ProtectedRoute><Garden /></ProtectedRoute>} />
            <Route path="/community" element={<Community />} />
            <Route path="/green-ai" element={<GreenAI />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
