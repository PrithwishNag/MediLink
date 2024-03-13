import "bootstrap/dist/css/bootstrap.min.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import useAuth from "./components/UseAuth";
import { constants } from "./constants/Contants";
import { InsuranceDashboard } from "./pages/InsuranceDashboard";

function App() {
  const isAuthenticated = useAuth();
  const userType = localStorage.getItem(constants.userTypeKey);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/home" /> : <AuthPage />}
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              userType === "Patient" ? (
                <HomePage />
              ) : (
                <InsuranceDashboard />
              )
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
