"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { CheckCircle, X, Download, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessNotificationProps {
  message: string;
  filename?: string;
  generationMethod?: "client" | "backend";
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

export function SuccessNotification({
  message,
  filename,
  generationMethod = "client",
  duration = 5000,
  onDismiss,
  className = "",
}: SuccessNotificationProps) {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);
  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };
  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          if (newProgress <= 0) {
            clearInterval(interval);
            handleDismiss();
            return 0;
          }
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [duration, handleDismiss]);

  const getMethodColor = () => {
    return generationMethod === "backend"
      ? "from-blue-500 to-blue-600"
      : "from-[#541C9C] to-[#680099]";
  };

  const getMethodIcon = () => {
    return generationMethod === "backend" ? (
      <Download className="h-5 w-5" />
    ) : (
      <FileText className="h-5 w-5" />
    );
  };

  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        "border-2 border-green-200 bg-green-50 shadow-lg transition-all duration-300 transform",
        isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        className
      )}
    >
      <CardContent className="p-4">
        {/* Progress bar */}
        {duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-green-200 rounded-t-lg overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 relative">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div
              className={cn(
                "absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-r text-white shadow-sm",
                getMethodColor()
              )}
            >
              {getMethodIcon()}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-green-800">
                PDF Generated Successfully!
              </h3>
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                <span className="capitalize">{generationMethod}</span>
              </div>
            </div>

            <p className="text-sm text-green-700 mb-2">{message}</p>

            {filename && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-white/50 px-3 py-1.5 rounded-lg border border-green-200">
                <FileText className="h-3 w-3" />
                <span className="font-mono truncate">{filename}</span>
              </div>
            )}
          </div>

          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-green-600 hover:bg-green-100 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="flex items-center justify-between text-xs text-green-600">
            <span>
              Generated using{" "}
              {generationMethod === "backend" ? "server-side" : "client-side"}{" "}
              processing
            </span>
            {duration > 0 && (
              <span className="opacity-70">
                Auto-dismiss in {Math.ceil(progress / 20)}s
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
