import { Suspense } from "react";
import AuthSidebar from "@/components/auth/AuthSidebar";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen flex w-full bg-[#09090b]">
      <AuthSidebar />
      <Suspense fallback={<div className="w-full lg:w-1/2 bg-white" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}

