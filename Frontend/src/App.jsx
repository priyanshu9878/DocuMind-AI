import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/clerk-react";
const API_URL = import.meta.env.VITE_API_URL;

import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ChatPage from "./chatPage.jsx";

function SyncUser() {
  const { getToken } = useAuth();

  useEffect(() => {
    const sync = async () => {
      try {
        const token = await getToken();

        if (!token) return;

        await fetch(`${API_URL}/api/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("User sync failed:", err);
      }
    };

    sync();
  }, [getToken]);

  return null;
}

function App() {
  return (
    <BrowserRouter>

      {/* =========================
          LOGGED OUT USERS
      ========================== */}
      <SignedOut>
        <Routes>
          <Route
            path="*"
            element={
              <>
                <LandingPage />

                <div className="fixed top-6 right-6 flex gap-4 z-50">

                  {/* SIGN IN */}
                  <SignInButton
                    mode="modal"
                    forceRedirectUrl="/dashboard"
                  >
                    <button
                      className="px-4 py-2 rounded-lg bg-green-600
                      h-10 w-24 font-extrabold text-white
                      hover:bg-green-500 transition"
                    >
                      Sign In
                    </button>
                  </SignInButton>

                  {/* SIGN UP */}
                  <SignUpButton
                    mode="modal"
                    forceRedirectUrl="/dashboard"
                  >
                    <button
                      className="px-4 py-2 h-10 w-24 rounded-lg
                      border-[3px] border-green-600 text-green-500
                      hover:border-green-300 transition"
                    >
                      Sign Up
                    </button>
                  </SignUpButton>

                </div>
              </>
            }
          />
        </Routes>
      </SignedOut>


      {/* =========================
          LOGGED IN USERS
      ========================== */}
      <SignedIn>

        <SyncUser />

        {/* User profile */}
        <div className="fixed top-6 right-6 z-50">
          <UserButton afterSignOutUrl="/" />
        </div>

        <Routes>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Chat */}
          <Route
            path="/chat/:fileId"
            element={<ChatPage />}
          />

          {/* Unknown route */}
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>

      </SignedIn>

    </BrowserRouter>
  );
}

export default App;