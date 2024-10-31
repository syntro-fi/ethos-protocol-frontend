"use client";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AuthBoundary from "@/components/AuthBoundary";

export default function Home() {
  return (
    <div className="flex h-full mx-auto w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <Header />
      <section className="w-full py-4 md:grow">
        <AuthBoundary>
          <a href="/mission/new" className="text-blue-500 underline">
            Create New Mission
          </a>
        </AuthBoundary>
      </section>
      <Footer />
    </div>
  );
}
