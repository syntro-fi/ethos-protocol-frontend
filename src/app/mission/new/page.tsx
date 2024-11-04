'use client';

import AuthBoundary from '@/components/AuthBoundary';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MissionForm from '@/components/mission/MissionForm';
import type { SCHEMA } from '@/components/mission/MissionForm';
import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import type { z } from 'zod';

import { MISSION_FACTORY_ADDRESS } from '@/constants';
import missionFactoryAbiJson from '@/contracts/abis/MissionFactory.sol/MissionFactory.json';

interface MissionConfig {
  sponsor: string;
  startDate: bigint;
  endDate: bigint;
  distributionStrategy: bigint;
  addtlDataCid: string;
}

function useContractTransaction() {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState(false);

  const executeTransaction = async (missionConfig: MissionConfig) => {
    if (!walletClient) {
      throw new Error('Wallet client not connected');
    }

    if (!publicClient) {
      throw new Error('Public client not initialized');
    }

    setIsLoading(true);

    const [address] = await walletClient.getAddresses();
    const request = {
      address: MISSION_FACTORY_ADDRESS as `0x${string}`,
      abi: missionFactoryAbiJson.abi,
      functionName: 'createMission',
      args: [
        {
          sponsor: missionConfig.sponsor,
          startDate: missionConfig.startDate,
          endDate: missionConfig.endDate,
          distributionStrategy: missionConfig.distributionStrategy,
          addtlDataCid: missionConfig.addtlDataCid,
        },
        '0x0000000000000000000000000000000000000001',
        '0x0000000000000000000000000000000000000002',
      ],
      account: address,
    };

    try {
      const sim = await publicClient.simulateContract(request);

      console.log('Simulation successful, sending transaction...', sim);

      const hash = await walletClient.writeContract(request);

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      // If simulation succeeds, send the actual transaction
      console.log('Transaction hash:', hash);

      // Wait for transaction receipt
      console.log('Transaction receipt:', receipt);

      return hash;
    } finally {
      setIsLoading(false);
    }
  };

  return { executeTransaction, isLoading };
}

export default function NewMission() {
  const { address } = useAccount();
  const { executeTransaction, isLoading } = useContractTransaction();

  const handleSubmit = async (formData: z.infer<typeof SCHEMA>) => {
    if (!address) {
      throw new Error('Please connect your wallet');
    }

    const descriptionCid = 'QmQ4321';

    const missionConfig = {
      sponsor: address,
      startDate: BigInt(Math.floor(Date.now() / 1000)),
      endDate: BigInt(Math.floor(formData.deadline.getTime() / 1000)),
      distributionStrategy: 0n,
      addtlDataCid: descriptionCid,
    };
    console.log('missionConfig', missionConfig);

    try {
      const hash = await executeTransaction(missionConfig);
      // Handle success (e.g., show success message, reset form)
      console.log('success', hash);
    } catch (err) {
      console.error('error', err);
    }
  };

  return (
    <div className="flex h-full mx-auto w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <Header />
      <section className="w-full py-4 md:grow">
        <AuthBoundary>
          <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Create New Mission</h1>
            <MissionForm onSubmit={handleSubmit} />
            {isLoading ? 'Confirming...' : ''}
          </div>
        </AuthBoundary>
      </section>
      <Footer />
    </div>
  );
}
