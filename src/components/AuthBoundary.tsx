import type { ReactNode } from 'react';
import { useAccount } from 'wagmi';

type AuthBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function AuthBoundary({ children, fallback }: AuthBoundaryProps) {
  const { address } = useAccount();

  if (!address) {
    return (
      fallback || (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <p>Please login to continue</p>
        </div>
      )
    );
  }

  return <>{children}</>;
}
