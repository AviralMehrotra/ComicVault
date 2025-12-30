import React from "react";
import AuthLayout from "../components/layout/AuthLayout";
import Login from "../components/auth/Login";
import { useTitle } from "@/hooks/useTitle";

const LoginPage = () => {
  useTitle("SignIn");
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;
