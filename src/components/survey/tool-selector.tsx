"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { VIBE_CODING_TOOLS } from "@/constants/survey-tools";

interface ToolSelectorProps {
  selectedTools: string[];
  onToggle: (toolId: string) => void;
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}

const categoryLabels: Record<string, string> = {
  "vscode-fork": "VSCode Forks",
  "vscode-extension": "VSCode Extensions",
  cli: "Terminal / CLI",
  cloud: "Cloud IDEs",
  agent: "AI Agents",
  terminal: "Terminal",
  tool: "Tools",
  other: "Other",
};

export function ToolSelector({ 
  selectedTools, 
  onToggle, 
  otherText = "", 
  onOtherTextChange 
}: ToolSelectorProps) {
  // Group tools by category
  const groupedTools = VIBE_CODING_TOOLS.reduce((acc, tool) => {
    const category = tool.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof VIBE_CODING_TOOLS[number][]>);

  const isOtherSelected = selectedTools.includes("other");

  return (
    <div className="space-y-6">
      {Object.entries(groupedTools).map(([category, tools]) => (
        <div key={category}>
          <h4 className="font-mono text-xs text-fg-muted uppercase tracking-wider mb-3">
            {categoryLabels[category] || category}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {tools.map((tool) => {
              const isSelected = selectedTools.includes(tool.id);
              return (
                <label
                  key={tool.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-sm border transition-all text-left cursor-pointer",
                    isSelected
                      ? "bg-pink-ghost border-pink text-fg-primary"
                      : "bg-surface-raised border-border-subtle text-fg-secondary hover:border-border-default hover:text-fg-primary"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(tool.id)}
                  />
                  <span className="text-sm">{tool.name}</span>
                </label>
              );
            })}
          </div>
          
          {/* Show input field when "Other" is selected */}
          {category === "other" && isOtherSelected && (
            <div className="mt-3">
              <Input
                placeholder="What tools are you using?"
                value={otherText}
                onChange={(e) => onOtherTextChange?.(e.target.value)}
                className="bg-surface-raised"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
