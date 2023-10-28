"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "./ui/button";
import { trpc } from "@/app/_trpc/client";

export function UpgradeButton() {
  return (
    <Button onClick={() => {}} className="w-full">
      Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
    </Button>
  );
}
