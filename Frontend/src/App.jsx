import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CookieBanner from "./components/CookieBanner";
import FloatingChatButton from "./components/FloatingChatButton";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import AdminPanel from "./pages/AdminPanel";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (<QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/catalog" element={<Catalog />}/>
              <Route path="/product/:id" element={<ProductDetail />}/>
              <Route path="/cart" element={<Cart />}/>
              <Route path="/login" element={<Login />}/>
              <Route path="/about" element={<About />}/>
              <Route path="/contact" element={<Contact />}/>
              <Route path="/privacy" element={<Privacy />}/>
              <Route path="/faq" element={<FAQ />}/>
              <Route path="/wishlist" element={<Wishlist />}/>
              <Route path="/profile" element={<ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>}/>
              <Route path="/checkout" element={<ProtectedRoute>
                      <Checkout />
                  </ProtectedRoute>}/>
              <Route path="/payment-success" element={<ProtectedRoute>
                      <PaymentSuccess />
                  </ProtectedRoute>}/>
              <Route path="/orders" element={<ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>}/>
              <Route path="/orders/:id" element={<ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>}/>
              <Route path="/admin" element={<ProtectedRoute requireAdmin>
                    <AdminPanel />
                  </ProtectedRoute>}/>
              <Route path="/pharmacist" element={<ProtectedRoute requirePharmacist>
                    <PharmacistDashboard />
                  </ProtectedRoute>}/>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
          <FloatingChatButton />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>);
export default App;
