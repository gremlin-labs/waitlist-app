"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_WORDS = 500;

function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const JOB_OPTIONS = [
  { id: "zig-ml", title: "Zig Engineer — Machine Learning", passion: "optimizing inference" },
  { id: "zig-perf", title: "Zig Engineer — App Performance", passion: "building apps" },
  { id: "swiftui", title: "SwiftUI Engineer", passion: "building apps" },
  { id: "fullstack", title: "Full Stack TypeScript Developer", passion: "writing code" },
  { id: "marketing", title: "Marketing Lead", passion: "marketing" },
] as const;

type JobId = (typeof JOB_OPTIONS)[number]["id"];

const isDeveloperRole = (job: JobId) => 
  ["zig-ml", "zig-perf", "swiftui", "fullstack"].includes(job);

const getPassionPrompt = (job: JobId) => {
  const jobInfo = JOB_OPTIONS.find(j => j.id === job);
  return jobInfo?.passion || "what you do";
};

interface ApplicationFormProps {
  selectedJob: JobId;
  userEmail: string;
  userName?: string;
}

export function ApplicationForm({ selectedJob, userEmail, userName }: ApplicationFormProps) {
  const router = useRouter();
  const [job, setJob] = useState<JobId>(selectedJob);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [passionResponse, setPassionResponse] = useState("");
  const [workStyleResponse, setWorkStyleResponse] = useState("");
  const [experienceResponse, setExperienceResponse] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  // Word counts
  const passionWordCount = countWords(passionResponse);
  const workStyleWordCount = countWords(workStyleResponse);
  const experienceWordCount = countWords(experienceResponse);

  // Validation
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+/i;
  const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+/i;

  const isLinkedinValid = linkedinUrl === "" || linkedinRegex.test(linkedinUrl);
  const isGithubValid = githubUrl === "" || githubRegex.test(githubUrl);
  const isPassionValid = passionWordCount <= MAX_WORDS;
  const isWorkStyleValid = workStyleWordCount <= MAX_WORDS;
  const isExperienceValid = experienceWordCount <= MAX_WORDS;

  const isDev = isDeveloperRole(job);
  const passionTopic = getPassionPrompt(job);

  const canSubmit = 
    passionResponse.trim() !== "" &&
    workStyleResponse.trim() !== "" &&
    experienceResponse.trim() !== "" &&
    linkedinUrl.trim() !== "" &&
    isLinkedinValid &&
    isPassionValid &&
    isWorkStyleValid &&
    isExperienceValid &&
    (isDev ? githubUrl.trim() !== "" && isGithubValid : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobRole: job,
          passionResponse,
          workStyleResponse,
          experienceResponse,
          linkedinUrl,
          githubUrl: isDev ? githubUrl : null,
          portfolioUrl: portfolioUrl || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit application");
      }

      // Clear the cookie
      document.cookie = "apply_job=; path=/; max-age=0";
      
      // Redirect to success page
      router.push("/apply/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-md bg-red-dim border border-red text-red text-sm">
          {error}
        </div>
      )}

      {/* User info display */}
      <div className="p-4 rounded-md bg-surface-raised border border-border-subtle">
        <p className="text-sm text-fg-muted">
          Applying as <span className="text-fg-primary font-medium">{userName || userEmail}</span>
        </p>
      </div>

      {/* Job Selection */}
      <div className="space-y-2">
        <Label htmlFor="job">Position</Label>
        <Select value={job} onValueChange={(v) => setJob(v as JobId)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a position" />
          </SelectTrigger>
          <SelectContent>
            {JOB_OPTIONS.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Passion Question - Dynamic based on job */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="passion">
            Tell us about what you love about {passionTopic}
          </Label>
          <span className={cn(
            "text-xs font-mono",
            passionWordCount > MAX_WORDS ? "text-red" : "text-fg-muted"
          )}>
            {passionWordCount}/{MAX_WORDS}
          </span>
        </div>
        <Textarea
          id="passion"
          placeholder="What gets you excited? What problems do you love solving?"
          value={passionResponse}
          onChange={(e) => setPassionResponse(e.target.value)}
          rows={4}
          required
          className={cn(!isPassionValid && "border-red focus:ring-red")}
        />
        {!isPassionValid && (
          <p className="text-red text-xs">Please keep your response under {MAX_WORDS} words</p>
        )}
      </div>

      {/* Work Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="workStyle">
            Describe how you like to work
          </Label>
          <span className={cn(
            "text-xs font-mono",
            workStyleWordCount > MAX_WORDS ? "text-red" : "text-fg-muted"
          )}>
            {workStyleWordCount}/{MAX_WORDS}
          </span>
        </div>
        <Textarea
          id="workStyle"
          placeholder="Remote? Async? Deep focus? Collaboration? What does your ideal work day look like?"
          value={workStyleResponse}
          onChange={(e) => setWorkStyleResponse(e.target.value)}
          rows={4}
          required
          className={cn(!isWorkStyleValid && "border-red focus:ring-red")}
        />
        {!isWorkStyleValid && (
          <p className="text-red text-xs">Please keep your response under {MAX_WORDS} words</p>
        )}
      </div>

      {/* Experience */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="experience">
            Share any relevant experience
          </Label>
          <span className={cn(
            "text-xs font-mono",
            experienceWordCount > MAX_WORDS ? "text-red" : "text-fg-muted"
          )}>
            {experienceWordCount}/{MAX_WORDS}
          </span>
        </div>
        <Textarea
          id="experience"
          placeholder="Projects, roles, achievements—anything that shows you'd be great at this"
          value={experienceResponse}
          onChange={(e) => setExperienceResponse(e.target.value)}
          rows={4}
          required
          className={cn(!isExperienceValid && "border-red focus:ring-red")}
        />
        {!isExperienceValid && (
          <p className="text-red text-xs">Please keep your response under {MAX_WORDS} words</p>
        )}
      </div>

      {/* Links Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-pink" />
          <h3 className="font-medium text-fg-primary">Links</h3>
        </div>

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">
            LinkedIn <span className="text-pink">*</span>
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            required
            className={!isLinkedinValid ? "border-red focus:ring-red" : ""}
          />
          {!isLinkedinValid && (
            <p className="text-red text-xs">Please enter a valid LinkedIn URL</p>
          )}
        </div>

        {/* GitHub - Developer roles only */}
        {isDev && (
          <div className="space-y-2">
            <Label htmlFor="github">
              GitHub <span className="text-pink">*</span>
            </Label>
            <Input
              id="github"
              type="url"
              placeholder="https://github.com/yourusername"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
              className={!isGithubValid ? "border-red focus:ring-red" : ""}
            />
            {!isGithubValid && (
              <p className="text-red text-xs">Please enter a valid GitHub URL</p>
            )}
          </div>
        )}

        {/* Portfolio */}
        <div className="space-y-2">
          <Label htmlFor="portfolio">
            Portfolio or example project
            <span className="text-fg-muted text-xs ml-2">(optional)</span>
          </Label>
          <Input
            id="portfolio"
            type="url"
            placeholder="https://yourportfolio.com"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full gap-2"
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-fg-dim">
        We&apos;ll review your application and get back to you within a week.
        <br />
        No ghosting—we promise.
      </p>
    </form>
  );
}
