"use client";

import { GoogleLogin } from "@react-oauth/google";
import API from "../app/api/axios";
import { useAuth } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const { checkAuth } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    try {
        const res = await API.post("/auth/google", { token: idToken });
        console.log(res);
        await checkAuth();
    } catch (err) {
        console.log(err);
    }
  };

  const handleError = () => {
    console.log("Google Login Failed");
  }

  return (
    <div className="w-fit">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        theme="outline"
        size="large"
        text="signin"
        shape="pill"
        width="120"
      />
    </div>
  );
}