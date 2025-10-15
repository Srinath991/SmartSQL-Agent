'use client'
import Hero from "@/components/Hero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function Home() {
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  const check_health = () => {
    setIsCheckingHealth(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const startedAt = Date.now();
    fetch(`${baseUrl}/health`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        const elapsed = Date.now() - startedAt;
        const minimumVisibleMs = 1000; // ensure the toast is visible long enough to notice
        const remaining = Math.max(0, minimumVisibleMs - elapsed);
        setTimeout(() => setIsCheckingHealth(false), remaining);
      });
  };

  useEffect(() => {
    check_health();
  }, []);

  return (
    <div>
      {/* Toast: visible while health check is in-flight, styled to match app */}
      {isCheckingHealth && (
        <div className="fixed top-6 right-6 z-[9999] transition-all duration-300 transform">
        <div className="flex items-center gap-3 bg-gray-900/95 text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-gray-800">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          <span className="text-sm sm:text-base">Please wait, the Backend server is spinning up..</span>
        </div>
      </div>
      )}
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}