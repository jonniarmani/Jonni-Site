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
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

import { ContentProvider, useContent } from "./lib/ContentContext";
import Admin from "./pages/Admin";
import CodeInjection from "./components/CodeInjection";
import SEO from "./components/SEO";

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
        <div className="flex flex-col min-h-screen selection:bg-brand-gold selection:text-white relative">
          <div className="grain-overlay" />
          
          {/* Scroll Progress HUD */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-brand-gold z-[101] origin-left"
            style={{ scaleX: useScroll().scrollYProgress }}
          />

          <Header />
          <PromoPopup />
          <main className="flex-grow">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/video" element={<Video />} />
                <Route path="/photo" element={<Photo />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </PageTransition>
          </main>
          <Footer />
        </div>
      </Router>
    </ContentProvider>
  );
}
