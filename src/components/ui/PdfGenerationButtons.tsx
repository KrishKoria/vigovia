"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import { Progress } from "./progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./tooltip";
import {
  Download,
  Server,
  Info,
  CheckCircle,
  Clock,
  Wifi,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PdfGenerationButtonsProps {
  onClientGeneration: () => Promise<void>;
  onBackendGeneration: () => Promise<void>;
  isGeneratingClient: boolean;
  isGeneratingBackend: boolean;
  disabled?: boolean;
  className?: string;
}

export function PdfGenerationButtons({
  onClientGeneration,
  onBackendGeneration,
  isGeneratingClient,
  isGeneratingBackend,
  disabled = false,
  className = "",
}: PdfGenerationButtonsProps) {
  const [clientProgress, setClientProgress] = useState(0);
  const [backendProgress, setBackendProgress] = useState(0);
  const [clientStage, setClientStage] = useState("");
  const [backendStage, setBackendStage] = useState("");

  // Simulate progress for client generation
  useEffect(() => {
    if (isGeneratingClient) {
      setClientProgress(0);
      setClientStage("Preparing document...");

      const stages = [
        { progress: 20, stage: "Processing form data..." },
        { progress: 40, stage: "Generating PDF structure..." },
        { progress: 60, stage: "Rendering content..." },
        { progress: 80, stage: "Finalizing document..." },
        { progress: 100, stage: "Download ready!" },
      ];

      stages.forEach((stage, index) => {
        setTimeout(() => {
          setClientProgress(stage.progress);
          setClientStage(stage.stage);
        }, (index + 1) * 800);
      });
    } else {
      setClientProgress(0);
      setClientStage("");
    }
  }, [isGeneratingClient]);

  // Simulate progress for backend generation
  useEffect(() => {
    if (isGeneratingBackend) {
      setBackendProgress(0);
      setBackendStage("Connecting to server...");

      const stages = [
        { progress: 15, stage: "Sending data to server..." },
        { progress: 30, stage: "Server processing request..." },
        { progress: 50, stage: "Generating PDF on server..." },
        { progress: 70, stage: "Applying server templates..." },
        { progress: 85, stage: "Preparing download..." },
        { progress: 100, stage: "Download complete!" },
      ];

      stages.forEach((stage, index) => {
        setTimeout(() => {
          setBackendProgress(stage.progress);
          setBackendStage(stage.stage);
        }, (index + 1) * 1000);
      });
    } else {
      setBackendProgress(0);
      setBackendStage("");
    }
  }, [isGeneratingBackend]);

  const isAnyGenerating = isGeneratingClient || isGeneratingBackend;

  return (
    <TooltipProvider>
      <div className={cn("space-y-6", className)}>
        {/* Progress indicators */}
        {(isGeneratingClient || isGeneratingBackend) && (
          <div className="space-y-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#936FE0]/20">
            {isGeneratingClient && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#541C9C]">
                  <Download className="h-4 w-4" />
                  <span>Client PDF Generation</span>
                  <div className="flex-1" />
                  <span className="text-xs text-[#680099]/70">
                    {clientProgress}%
                  </span>
                </div>
                <Progress value={clientProgress} className="h-2" />
                <p className="text-xs text-[#680099]/70 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {clientStage}
                </p>
              </div>
            )}

            {isGeneratingBackend && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#2563eb]">
                  <Server className="h-4 w-4" />
                  <span>Backend PDF Generation</span>
                  <div className="flex-1" />
                  <span className="text-xs text-[#1d4ed8]/70">
                    {backendProgress}%
                  </span>
                </div>
                <Progress value={backendProgress} className="h-2" />
                <p className="text-xs text-[#1d4ed8]/70 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {backendStage}
                </p>
              </div>
            )}
          </div>
        )}

        {/* PDF Generation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Client PDF Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onClientGeneration}
                disabled={disabled || isAnyGenerating}
                className="bg-gradient-to-r from-[#541C9C] via-[#680099] to-[#936FE0] hover:from-[#680099] hover:via-[#541C9C] hover:to-[#680099] text-white px-12 py-6 text-lg font-bold min-w-[280px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGeneratingClient ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg">Generating PDF...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5" />
                    <span className="text-lg">Generate PDF (Client)</span>
                    <Zap className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Client-side Generation</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Faster processing (no network delay)</li>
                  <li>• Works offline</li>
                  <li>• Generated in your browser</li>
                  <li>• Basic PDF features</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>

          {/* Backend PDF Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onBackendGeneration}
                disabled={disabled || isAnyGenerating}
                className="bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#1e40af] hover:from-[#1d4ed8] hover:via-[#2563eb] hover:to-[#1d4ed8] text-white px-12 py-6 text-lg font-bold min-w-[280px] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGeneratingBackend ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-lg">Generating PDF...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Server className="h-5 w-5" />
                    <span className="text-lg">Generate PDF (Backend)</span>
                    <CheckCircle className="h-4 w-4 opacity-70" />
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Server-side Generation</span>
                </div>
                <ul className="text-sm space-y-1">
                  <li>• Advanced PDF features</li>
                  <li>• Professional templates</li>
                  <li>• Server-side processing</li>
                  <li>• Requires internet connection</li>
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Help text with enhanced styling */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-[#680099]/80">
            <Info className="h-4 w-4" />
            <span className="font-medium">
              Choose your preferred PDF generation method
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#680099]/70">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="font-medium">Client:</span>
              </div>
              <span>Fast, offline-capable</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-[#936FE0]/30"></div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Wifi className="h-3 w-3 text-blue-500" />
                <span className="font-medium">Backend:</span>
              </div>
              <span>Advanced features, requires connection</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
