
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to Dashboard directly
    navigate("/", { replace: true });
  }, [navigate]);
  
  // Return Dashboard as fallback in case redirect doesn't happen immediately
  return <Dashboard />;
};

export default Index;
