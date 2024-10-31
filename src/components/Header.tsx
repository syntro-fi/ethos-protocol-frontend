"use client";
import { useAccount } from "wagmi";
import LoginButton from "./LoginButton";
import SignupButton from "./SignupButton";

export default function Header() {
  const { address } = useAccount();

  return (
    <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
      <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
        <a href="/" title="ethos protocol" target="_blank" rel="noreferrer">
          <img src="/ethos-logo.png" alt="ethos protocol" className="h-16" />
        </a>
        <div className="flex items-center gap-3">
          <SignupButton />
          {!address && <LoginButton />}
        </div>
      </div>
    </section>
  );
}
