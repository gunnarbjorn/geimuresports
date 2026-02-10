import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Aefingar from "./pages/Aefingar";
import Mot from "./pages/Mot";
import Skraning from "./pages/Skraning";
import Um from "./pages/Um";
import HafaSamband from "./pages/HafaSamband";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Fortnite from "./pages/Fortnite";
import Maps from "./pages/fortnite/Maps";
import MapCategory from "./pages/fortnite/MapCategory";
import Tips from "./pages/fortnite/Tips";
import TipArticle from "./pages/fortnite/TipArticle";
import Ranked from "./pages/fortnite/Ranked";
import Community from "./pages/fortnite/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fortnite" element={<Fortnite />} />
          <Route path="/fortnite/maps" element={<Maps />} />
          <Route path="/fortnite/maps/:category" element={<MapCategory />} />
          <Route path="/fortnite/tips" element={<Tips />} />
          <Route path="/fortnite/tips/:topic" element={<TipArticle />} />
          <Route path="/fortnite/ranked" element={<Ranked />} />
          <Route path="/fortnite/community" element={<Community />} />
          <Route path="/aefingar" element={<Aefingar />} />
          <Route path="/mot" element={<Mot />} />
          <Route path="/skraning" element={<Skraning />} />
          <Route path="/um" element={<Um />} />
          <Route path="/hafa-samband" element={<HafaSamband />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
