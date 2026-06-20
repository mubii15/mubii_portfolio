import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { Preloader } from './components/Preloader';
import { ScrollToTop } from './components/ScrollToTop';
import { FilmGrain } from './components/FilmGrain';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Photography = lazy(() => import('./pages/Photography').then(module => ({ default: module.Photography })));
const Cinematography = lazy(() => import('./pages/Cinematography').then(module => ({ default: module.Cinematography })));
const VFX = lazy(() => import('./pages/VFX').then(module => ({ default: module.VFX })));
const ContemporaryArt = lazy(() => import('./pages/ContemporaryArt').then(module => ({ default: module.ContemporaryArt })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const CategoryGallery = lazy(() => import('./pages/CategoryGallery').then(module => ({ default: module.CategoryGallery })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then(module => ({ default: module.ProjectDetail })));
const Contact = lazy(() => import('./pages/Contact').then(module => ({ default: module.Contact })));
const NotFound = lazy(() => import('./pages/NotFound').then(module => ({ default: module.NotFound })));

// Admin lazy loading
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then(module => ({ default: module.AdminLayout })));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects').then(module => ({ default: module.AdminProjects })));
const AdminMedia = lazy(() => import('./pages/admin/AdminMedia').then(module => ({ default: module.AdminMedia })));
const AdminProjectEditor = lazy(() => import('./pages/admin/AdminProjectEditor').then(module => ({ default: module.AdminProjectEditor })));
const AdminUpload = lazy(() => import('./pages/admin/AdminUpload').then(module => ({ default: module.AdminUpload })));
const AdminShop = lazy(() => import('./pages/admin/AdminShop').then(module => ({ default: module.AdminShop })));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then(module => ({ default: module.AdminOrders })));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories').then(module => ({ default: module.AdminCategories })));
const AdminPages = lazy(() => import('./pages/admin/AdminPages').then(module => ({ default: module.AdminPages })));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(module => ({ default: module.AdminSettings })));
const AdminAuth = lazy(() => import('./components/admin/AdminAuth').then(module => ({ default: module.AdminAuth })));

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <FilmGrain />
      <Navigation />
    <main>
    <Suspense fallback={<LoadingFallback />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="/photography"
            element={
              <PageTransition>
                <Photography />
              </PageTransition>
            }
          />
          <Route
            path="/cinematography"
            element={
              <PageTransition>
                <Cinematography />
              </PageTransition>
            }
          />
          <Route
            path="/vfx"
            element={
              <PageTransition>
                <VFX />
              </PageTransition>
            }
          />
          <Route
            path="/art"
            element={
              <PageTransition>
                <ContemporaryArt />
              </PageTransition>
            }
          />
          <Route
            path="/about"
            element={
              <PageTransition>
                <About />
              </PageTransition>
            }
          />
          <Route
            path="/contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />
          <Route
            path="/gallery/:category"
            element={
              <PageTransition>
                <CategoryGallery />
              </PageTransition>
            }
          />
          <Route
            path="/gallery"
            element={
              <PageTransition>
                <CategoryGallery />
              </PageTransition>
            }
          />
          <Route
            path="/project/:id"
            element={
              <PageTransition>
                <ProjectDetail />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />

          <Route path="/admin" element={
            <AdminAuth>
              <AdminLayout />
            </AdminAuth>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="upload" element={<AdminUpload />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/:id" element={<AdminProjectEditor />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="shop" element={<AdminShop />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
    </main>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      <motion.div 
        className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <AnimatePresence>
          {isLoading && (
            <Preloader key="preloader" onComplete={() => setIsLoading(false)} />
          )}
        </AnimatePresence>
        
        <ScrollToTop />
        <CustomCursor />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
