/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll } from "motion/react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";
import PromoPopup from "./components/PromoPopup";
import CodeInjection from "./components/CodeInjection";
import FloatingActionHub from "./components/FloatingActionHub";
import SEO from "./components/SEO";
import { ContentProvider } from "./lib/ContentContext";

// Lazy load pages for performance
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Video = lazy(() => import("./pages/Video"));
const Photo = lazy(() => import("./pages/Photo"));
const Contact = lazy(() => import("./pages/Contact"));
const Booking = lazy(() => import("./pages/Booking"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Admin = lazy(() => import("./pages/Admin"));
const Portal = lazy(() => import("./pages/Portal"));

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
      <Router>
        <ScrollToTop />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-brand-cyan focus:text-white focus:font-bold focus:uppercase focus:tracking-widest focus:rounded-full">
          Skip to content
        </a>
        <div className="flex flex-col min-h-screen selection:bg-brand-cyan selection:text-white relative">
          
          {/* Scroll Progress HUD */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[2px] bg-brand-cyan z-[101] origin-left"
            style={{ scaleX: useScroll().scrollYProgress }}
          />

          <Header />
          <PromoPopup />
          <FloatingActionHub />
          <main id="main-content" className="flex-grow">
            <PageTransition>
              <Suspense fallback={<div className="h-screen w-full bg-brand-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div></div>}>
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
              </Suspense>
            </PageTransition>
          </main>
          <Footer />
        </div>
      </Router>
    </ContentProvider>
  );
}
