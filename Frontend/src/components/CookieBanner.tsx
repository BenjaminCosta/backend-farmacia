import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Mostrar el banner después de un pequeño delay para mejor UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700 shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Icono y Texto */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-2">
                  🍪 Uso de Cookies
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia de navegación, personalizar contenido y
                  analizar nuestro tráfico. Al hacer clic en "Aceptar", aceptas nuestro uso de cookies.{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
                    onClick={() => setShowBanner(false)}
                  >
                    Política de Privacidad
                  </Link>
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={declineCookies}
                className="flex-1 sm:flex-none bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-200"
              >
                Rechazar
              </Button>
              <Button
                onClick={acceptCookies}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg shadow-blue-900/50 transition-all duration-200 transform hover:scale-105"
              >
                Aceptar Cookies
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={declineCookies}
                className="hidden sm:flex text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
