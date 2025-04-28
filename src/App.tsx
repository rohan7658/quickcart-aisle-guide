
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ShoppingListProvider } from "./contexts/ShoppingListContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateListPage from "./pages/CreateListPage";
import NavigationPage from "./pages/NavigationPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <FirebaseProvider>
          <AuthProvider>
            <ShoppingListProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                      path="/create-list" 
                      element={
                        <ProtectedRoute>
                          <CreateListPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/navigation" 
                      element={
                        <ProtectedRoute>
                          <NavigationPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin>
                          <AdminPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </ShoppingListProvider>
          </AuthProvider>
        </FirebaseProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
