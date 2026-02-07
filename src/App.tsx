import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "@/features/land/pages/LandingPage";
import SignupPage from "@/features/auth/signup/pages/SignupPage";
import LoginPage from "@/features/auth/login/pages/LoginPage";
import ApplicationListPage from "@/features/admin/pages/ApplicationListPage";

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 랜딩 페이지 */}
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <LandingPage />
            </motion.div>
          }
        />

        {/* 회원가입 페이지 */}
        {/* 회원가입 페이지 */}
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

        {/* 로그인 페이지 */}
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

        {/* 관리자 페이지 */}
        <Route
          path="/admin/applications"
          element={
            <ApplicationListPage />
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
