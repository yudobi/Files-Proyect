import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/componentsAdmin/LoginForm";

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    //navigate("/dashboard");  Redirige después del login
    navigate("/dashboard"); // Redirige después del login
  };

  return (
    <div>
      
      <LoginForm onLogin={handleLoginSuccess} />
    </div>
  );
}

export default LoginPage;
