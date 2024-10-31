"use client";

import AuthBoundary from "@/components/AuthBoundary";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MissionForm from "@/components/mission/MissionForm";

export default function NewMission() {
  const handleSubmit = async (data: any) => {
    // TODO: Implement your submission logic here
    console.log(data);
  };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <Header />
      <section className="w-full py-4 md:grow">
        <AuthBoundary>
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Create New Mission</h1>
            <MissionForm onSubmit={handleSubmit} />
          </div>
        </AuthBoundary>
      </section>
      <Footer />
    </div>
  );
}
