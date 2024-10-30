"use client";

import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type EthosModule = {
  id: string;
  name: string;
  address: string;
  categoryName: string;
  categoryId: BigInt;
};

const ModuleSelector = ({
  onSelectionChange,
  selectedModules,
  allModules,
}: {
  onSelectionChange: (modules: EthosModule[]) => void;
  selectedModules: EthosModule[];
  allModules: EthosModule[];
}) => {
  const [availableModules, setAvailableModules] = useState<EthosModule[]>([]);

  useEffect(() => {
    if (allModules.length === 0) return;

    setAvailableModules(
      allModules.filter(
        (module) =>
          !selectedModules.some((selected) => selected.id === module.id)
      )
    );
  }, [allModules, selectedModules]);

  const addModule = (module: EthosModule) => {
    onSelectionChange([...selectedModules, module]);
  };

  const removeModule = (module: EthosModule) => {
    onSelectionChange(selectedModules.filter((m) => m.id !== module.id));
  };

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4">
          <h3 className="mb-2 font-semibold">Available Modules</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {availableModules.map((module) => (
              <Button
                key={module.id}
                variant="ghost"
                className="w-full justify-start text-sm"
                onClick={() => addModule(module)}
              >
                {module.name}
              </Button>
            ))}
          </ScrollArea>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4 mt-4">
        <div className="col-span-4">
          <h3 className="mb-2 font-semibold">Selected Modules</h3>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {selectedModules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm">{module.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeModule(module)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default function EligibilityModal() {
  const [allModules, setAllModules] = useState<EthosModule[]>([]);
  const [contributorModules, setContributorModules] = useState<EthosModule[]>(
    []
  );
  const [verifierModules, setVerifierModules] = useState<EthosModule[]>([]);
  const [activeTab, setActiveTab] = useState("contributor");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      if (allModules.length > 0) return;

      try {
        const response = await fetch("http://localhost:8080/v1/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query {
                EthosModule {
                  address
                  id
                  name
                }
              }
            `,
          }),
        });
        const data = await response.json();
        setAllModules(data.data.EthosModule);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    fetchModules();
  }, []);

  const handleSubmit = () => {
    // Add any submission logic here
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Select Modules
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Modules</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contributor">Contributor</TabsTrigger>
            <TabsTrigger value="verifier">Verifier</TabsTrigger>
          </TabsList>
          <TabsContent value="contributor">
            <ModuleSelector
              onSelectionChange={setContributorModules}
              selectedModules={contributorModules}
              allModules={allModules}
            />
          </TabsContent>
          <TabsContent value="verifier">
            <ModuleSelector
              onSelectionChange={setVerifierModules}
              selectedModules={verifierModules}
              allModules={allModules}
            />
          </TabsContent>
        </Tabs>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
