
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = "/login" 
}) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-plant-green" />
      </div>
    );
  }
  
  // If user is not authenticated, redirect to login
  if (!currentUser) {
    // Save the attempted URL for redirection after login
    const redirectUrl = encodeURIComponent(location.pathname);
    
    // Show toast notification about required login
    if (typeof window !== 'undefined') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        duration: 3000,
      });
    }
    
    return <Navigate to={`${redirectTo}?redirect=${redirectUrl}`} replace />;
  }
  
  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
