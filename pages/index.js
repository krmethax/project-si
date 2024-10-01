import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Wait for 5 seconds before redirecting to the login page
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000); // 5000ms = 5 seconds

    // Clear the timer when component unmounts to avoid memory leaks
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="loader"></div>
    </div>
  );
}
