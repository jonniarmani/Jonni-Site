/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll } from "motion/react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import PromoPopup from "./components/PromoPopup";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Video from "./pages/Video";
import Photo from "./pages/Photo";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Portal from "./pages/Portal";
import CodeInjection from "./components/CodeInjection";
import SEO from "./components/SEO";
import { ContentProvider } from "./lib/ContentContext";

// Helper to scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ContentProvider>
      <CodeInjection />
      <SEO />
      <Router>
        <ScrollToTop />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-brand-gold focus:text-white focus:font-bold focus:uppercase focus:tracking-widest focus:rounded-full">
          Skip to content
        </a>
        <div className="flex flex-col min-h-screen selection:bg-brand-gold selection:text-white relative">
          <div className="grain-overlay" />
          
          {/* Scroll Progress HUD */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-brand-gold z-[101] origin-left"
            style={{ scaleX: useScroll().scrollYProgress }}
          />

          <Header />
          <PromoPopup />
          <main id="main-content" className="flex-grow">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/video" element={<Video />} />
                <Route path="/photo" element={<Photo />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/portal/:id" element={<Portal />} />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
        </div>
      </Router>
    </ContentProvider>
  );
}
