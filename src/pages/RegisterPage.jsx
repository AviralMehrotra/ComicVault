import AuthLayout from "@/components/layout/AuthLayout";
import React from "react";
import SignUp from "./SignUp";
import { useTitle } from "@/hooks/useTitle";

const RegisterPage = () => {
  useTitle("SignUp");
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
};

export default RegisterPage;
