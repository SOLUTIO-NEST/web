import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import LandingPage from "@/features/land/pages/LandingPage";
import SignupPage from "@/features/auth/signup/pages/SignupPage";
import LoginPage from "@/features/auth/login/pages/LoginPage";
import ApplicationListPage from "@/features/admin/pages/ApplicationListPage";
import BlacklistPage from "@/features/admin/pages/BlacklistPage";
import CompetitionPage from "@/features/competition/pages/CompetitionPage";
import HistoryPage from "@/features/history/pages/HistoryPage";
import ContactPage from "@/features/contact/pages/ContactPage";
import StudyPage from "@/features/study/pages/StudyPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <PageHeader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full min-h-screen"
              >
                <LandingPage />
              </motion.div>
            }
          />

          <Route
            path="/signup"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <SignupPage />
              </motion.div>
            }
          />

          <Route
            path="/login"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <LoginPage />
              </motion.div>
            }
          />

          <Route
            path="/competition"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <CompetitionPage />
              </motion.div>
            }
          />

          <Route
            path="/history"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <HistoryPage />
              </motion.div>
            }
          />

          <Route
            path="/study"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <StudyPage />
              </motion.div>
            }
          />

          <Route
            path="/contact"
            element={
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full h-full"
              >
                <ContactPage />
              </motion.div>
            }
          />

          <Route
            path="/admin/applications"
            element={<ApplicationListPage />}
          />
          <Route
            path="/admin/blacklist"
            element={<BlacklistPage />}
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}
