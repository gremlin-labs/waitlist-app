"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "./step-indicator";
import { ToolSelector } from "./tool-selector";
import {
  VIBE_EXPERIENCE_OPTIONS,
  YEARS_EXPERIENCE_OPTIONS,
  JOB_ROLES,
  MAC_MODELS,
  HOW_HEARD_OPTIONS,
  VIBE_CODING_TOOLS,
} from "@/constants/survey-tools";
import { COUNTRIES, getTimezones } from "@/constants/countries";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

interface SurveyData {
  vibeCodeExperience: string;
  toolsUsed: string[];
  otherToolText: string;
  primaryTool: string;
  jobRole: string;
  otherJobRole: string;
  yearsExperience: string;
  macModel: string;
  ramGb: string;
  country: string;
  region: string;
  timezone: string;
  excitedAbout: string;
  biggestPainPoint: string;
  howHeardAboutUs: string;
}

interface SurveyFormProps {
  initialGeoData?: {
    country: string;
    region: string;
    timezone: string;
  };
}

const STEP_TITLES = [
  "Vibe Check",
  "Your Arsenal",
  "Your Journey",
  "Your Machine",
  "Your Location",
  "Your Vibes",
];

export function SurveyForm({ initialGeoData }: SurveyFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SurveyData>({
    vibeCodeExperience: "",
    toolsUsed: [],
    otherToolText: "",
    primaryTool: "",
    jobRole: "",
    otherJobRole: "",
    yearsExperience: "",
    macModel: "",
    ramGb: "",
    country: initialGeoData?.country || "",
    region: initialGeoData?.region || "",
    timezone: initialGeoData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    excitedAbout: "",
    biggestPainPoint: "",
    howHeardAboutUs: "",
  });

  const updateField = <K extends keyof SurveyData>(
    field: K,
    value: SurveyData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTool = (toolId: string) => {
    setFormData((prev) => ({
      ...prev,
      toolsUsed: prev.toolsUsed.includes(toolId)
        ? prev.toolsUsed.filter((t) => t !== toolId)
        : [...prev.toolsUsed, toolId],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!formData.vibeCodeExperience;
      case 1:
        return formData.toolsUsed.length > 0;
      case 2:
        return !!formData.jobRole && !!formData.yearsExperience;
      case 3:
        return !!formData.macModel;
      case 4:
        return !!formData.country && !!formData.timezone;
      case 5:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < STEP_TITLES.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit survey");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedToolNames = formData.toolsUsed
    .map((id) => VIBE_CODING_TOOLS.find((t) => t.id === id)?.name)
    .filter(Boolean);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={STEP_TITLES.length}
          stepTitles={STEP_TITLES}
        />
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-6 p-3 rounded-sm bg-red-dim border border-red text-red text-sm">
            {error}
          </div>
        )}

        {/* Step 1: Vibe Check */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-2">What&apos;s your vibe coding experience?</CardTitle>
              <CardDescription>
                Be honest — we won&apos;t judge (much) 😈
              </CardDescription>
            </div>
            <RadioGroup
              value={formData.vibeCodeExperience}
              onValueChange={(value) => updateField("vibeCodeExperience", value)}
              className="space-y-3"
            >
              {VIBE_EXPERIENCE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-4 rounded-sm border border-border-subtle bg-surface-raised cursor-pointer hover:border-border-default transition-colors has-[:checked]:border-pink has-[:checked]:bg-pink-ghost"
                >
                  <RadioGroupItem value={option.value} />
                  <span className="text-fg-primary">{option.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Your Arsenal */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-2">What tools have you used?</CardTitle>
              <CardDescription>
                Select all the AI coding tools you&apos;ve tried
              </CardDescription>
            </div>
            <ToolSelector
              selectedTools={formData.toolsUsed}
              onToggle={toggleTool}
              otherText={formData.otherToolText}
              onOtherTextChange={(text) => updateField("otherToolText", text)}
            />
            {formData.toolsUsed.length > 0 && (
              <div className="pt-4 border-t border-border-subtle">
                <Label className="text-fg-muted mb-2 block">
                  What&apos;s your primary tool right now?
                </Label>
                <Select
                  value={formData.primaryTool}
                  onValueChange={(value) => updateField("primaryTool", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your main tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedToolNames.map((name) => (
                      <SelectItem key={name} value={name!}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Your Journey */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-2">Tell us about your journey</CardTitle>
              <CardDescription>
                Help us understand where you&apos;re coming from
              </CardDescription>
            </div>
            <div className="space-y-6">
              <div>
                <Label>What&apos;s your role?</Label>
                <Select
                  value={formData.jobRole}
                  onValueChange={(value) => updateField("jobRole", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.jobRole === "Other" && (
                  <Input
                    placeholder="Please specify your role"
                    value={formData.otherJobRole}
                    onChange={(e) => updateField("otherJobRole", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
              <div>
                <Label>How long have you been building software?</Label>
                <RadioGroup
                  value={formData.yearsExperience}
                  onValueChange={(value) => updateField("yearsExperience", value)}
                  className="grid grid-cols-3 gap-2 mt-2"
                >
                  {YEARS_EXPERIENCE_OPTIONS.map((option) => {
                    const isSelected = formData.yearsExperience === option.value;
                    return (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center justify-center gap-2 p-3 rounded-sm border cursor-pointer transition-colors text-center",
                          isSelected
                            ? "border-pink bg-pink-ghost"
                            : "border-border-subtle bg-surface-raised hover:border-border-default"
                        )}
                      >
                        <RadioGroupItem value={option.value} className="sr-only" />
                        <span className="text-sm text-fg-primary">{option.label}</span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Your Machine */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-2">What&apos;s your machine?</CardTitle>
              <CardDescription>
                Vibe Mode is optimized for Apple Silicon — let us know what you&apos;re running
              </CardDescription>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Mac Model</Label>
                <Select
                  value={formData.macModel}
                  onValueChange={(value) => updateField("macModel", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Mac" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAC_MODELS.map((mac) => (
                      <SelectItem key={mac.id} value={mac.id}>
                        {mac.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>RAM (GB)</Label>
                <Select
                  value={formData.ramGb}
                  onValueChange={(value) => updateField("ramGb", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select RAM size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[8, 16, 24, 32, 36, 48, 64, 96, 128, 192, 256, 512].map((gb) => (
                      <SelectItem key={gb} value={gb.toString()}>
                        {gb} GB
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Your Location */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-2">Where are you based?</CardTitle>
              <CardDescription>
                We&apos;ve auto-detected your location — feel free to correct it
              </CardDescription>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => updateField("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Region / State</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => updateField("region", e.target.value)}
                  placeholder="e.g., California, London, Tokyo"
                />
              </div>
              <div>
                <Label>Timezone</Label>
                <Select
                  value={formData.timezone}
                  onValueChange={(value) => updateField("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timezone" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {getTimezones().map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Your Vibes (Optional) */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <CardTitle className="text-xl mb-2">Tell us about your vibes</CardTitle>
              <CardDescription>
                These are optional but help us understand you better
              </CardDescription>
            </div>
            <div className="space-y-4">
              <div>
                <Label>What excites you most about Vibe Mode?</Label>
                <Textarea
                  value={formData.excitedAbout}
                  onChange={(e) => updateField("excitedAbout", e.target.value)}
                  placeholder="I'm excited about..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label>What&apos;s your biggest pain point with current tools?</Label>
                <Textarea
                  value={formData.biggestPainPoint}
                  onChange={(e) => updateField("biggestPainPoint", e.target.value)}
                  placeholder="My biggest frustration is..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label>How did you hear about us?</Label>
                <Select
                  value={formData.howHeardAboutUs}
                  onValueChange={(value) => updateField("howHeardAboutUs", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOW_HEARD_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border-subtle">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < STEP_TITLES.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Complete Survey
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
