// Survey Tool Options for Beta Survey

export const VIBE_CODING_TOOLS = [
  // VSCode Forks & Extensions
  { id: "cursor", name: "Cursor", category: "vscode-fork" },
  { id: "windsurf", name: "Windsurf", category: "vscode-fork" },
  { id: "github_copilot", name: "GitHub Copilot", category: "vscode-extension" },
  { id: "continue_dev", name: "Continue.dev", category: "vscode-extension" },
  { id: "cline", name: "Cline", category: "vscode-extension" },
  { id: "roo_code", name: "Roo Code", category: "vscode-extension" },
  { id: "augment_code", name: "Augment Code", category: "vscode-extension" },

  // Terminal/CLI
  { id: "claude_code", name: "Claude Code", category: "cli" },
  { id: "aider", name: "Aider", category: "cli" },
  { id: "opencode", name: "OpenCode", category: "cli" },
  { id: "codex", name: "Codex CLI", category: "cli" },

  // Cloud IDEs
  { id: "replit", name: "Replit", category: "cloud" },
  { id: "lovable", name: "Lovable", category: "cloud" },

  // AI Agents
  { id: "devin", name: "Devin", category: "agent" },
  { id: "factory_ai", name: "Factory.ai", category: "agent" },

  // Other
  { id: "warp", name: "Warp", category: "terminal" },
  { id: "repoprompt", name: "RepoPrompt", category: "tool" },
  { id: "kiro", name: "Kiro", category: "tool" },
  { id: "trae", name: "Trae", category: "tool" },

  // Escape hatch
  { id: "other", name: "Other (please specify)", category: "other" },
] as const;

export const MAC_MODELS = [
  // M5 Series (2025+)
  { id: "m5_macbook_pro_14", name: 'MacBook Pro 14" (M5, 2025)', chip: "m5" },
  { id: "m5_macbook_pro_16", name: 'MacBook Pro 16" (M5 Pro/Max, 2025)', chip: "m5_pro" },

  // M4 Series (2024-2025)
  { id: "m4_macbook_air_13", name: 'MacBook Air 13" (M4, 2025)', chip: "m4" },
  { id: "m4_macbook_air_15", name: 'MacBook Air 15" (M4, 2025)', chip: "m4" },
  { id: "m4_macbook_pro_14", name: 'MacBook Pro 14" (M4, 2024)', chip: "m4" },
  { id: "m4_macbook_pro_14_pro", name: 'MacBook Pro 14" (M4 Pro/Max, 2024)', chip: "m4_pro" },
  { id: "m4_macbook_pro_16", name: 'MacBook Pro 16" (M4 Pro/Max, 2024)', chip: "m4_max" },
  { id: "m4_imac", name: "iMac 24\" (M4, 2024)", chip: "m4" },
  { id: "m4_mac_mini", name: "Mac Mini (M4/M4 Pro, 2024)", chip: "m4_pro" },
  { id: "m4_mac_studio", name: "Mac Studio (M4 Max, 2025)", chip: "m4_max" },

  // M3 Series (2023-2024)
  { id: "m3_macbook_air_13", name: 'MacBook Air 13" (M3, 2024)', chip: "m3" },
  { id: "m3_macbook_air_15", name: 'MacBook Air 15" (M3, 2024)', chip: "m3" },
  { id: "m3_macbook_pro_14", name: 'MacBook Pro 14" (M3, 2023)', chip: "m3" },
  { id: "m3_macbook_pro_14_pro", name: 'MacBook Pro 14" (M3 Pro/Max, 2023)', chip: "m3_max" },
  { id: "m3_macbook_pro_16", name: 'MacBook Pro 16" (M3 Pro/Max, 2023)', chip: "m3_max" },
  { id: "m3_imac", name: "iMac 24\" (M3, 2023)", chip: "m3" },
  { id: "m3_mac_studio", name: "Mac Studio (M3 Ultra, 2025)", chip: "m3_ultra" },

  // M2 Series (2022-2023)
  { id: "m2_macbook_air_13", name: 'MacBook Air 13" (M2, 2022)', chip: "m2" },
  { id: "m2_macbook_air_15", name: 'MacBook Air 15" (M2, 2023)', chip: "m2" },
  { id: "m2_macbook_pro_13", name: 'MacBook Pro 13" (M2, 2022)', chip: "m2" },
  { id: "m2_macbook_pro_14", name: 'MacBook Pro 14" (M2 Pro/Max, 2023)', chip: "m2_max" },
  { id: "m2_macbook_pro_16", name: 'MacBook Pro 16" (M2 Pro/Max, 2023)', chip: "m2_max" },
  { id: "m2_mac_mini", name: "Mac Mini (M2/M2 Pro, 2023)", chip: "m2_pro" },
  { id: "m2_mac_studio", name: "Mac Studio (M2 Max/Ultra, 2023)", chip: "m2_ultra" },

  // M1 Series (2020-2022)
  { id: "m1_macbook_air", name: "MacBook Air 13\" (M1, 2020)", chip: "m1" },
  { id: "m1_macbook_pro_13", name: 'MacBook Pro 13" (M1, 2020)', chip: "m1" },
  { id: "m1_macbook_pro_14", name: 'MacBook Pro 14" (M1 Pro/Max, 2021)', chip: "m1_max" },
  { id: "m1_macbook_pro_16", name: 'MacBook Pro 16" (M1 Pro/Max, 2021)', chip: "m1_max" },
  { id: "m1_imac", name: 'iMac 24" (M1, 2021)', chip: "m1" },
  { id: "m1_mac_mini", name: "Mac Mini (M1, 2020)", chip: "m1" },
  { id: "m1_mac_studio", name: "Mac Studio (M1 Max/Ultra, 2022)", chip: "m1_ultra" },

  // Intel (legacy)
  { id: "intel_macbook", name: "Intel MacBook (any)", chip: "intel" },
  { id: "intel_imac", name: "Intel iMac", chip: "intel" },
  { id: "intel_mac_pro", name: "Intel Mac Pro", chip: "intel" },

  // Other
  { id: "other", name: "Other / Not sure", chip: "other" },
] as const;

export const JOB_ROLES = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Principal Engineer",
  "Engineering Manager",
  "Tech Lead",
  "CTO / VP Engineering",
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Mobile Developer",
  "DevOps / SRE",
  "Data Engineer",
  "ML Engineer",
  "Product Manager",
  "Designer who codes",
  "Founder / Indie Hacker",
  "Student",
  "Hobbyist",
  "Other",
] as const;

export const VIBE_EXPERIENCE_OPTIONS = [
  { value: "never_heard", label: "Never heard of it" },
  { value: "curious", label: "Curious but haven't tried" },
  { value: "tried_it", label: "I've dabbled" },
  { value: "daily_viber", label: "Daily viber" },
  { value: "transcended", label: "Transcended (I no longer read code)" },
] as const;

export const YEARS_EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10+", label: "10+ years" },
  { value: "eternal", label: "Eternal" },
] as const;

export const HOW_HEARD_OPTIONS = [
  "Twitter / X",
  "Hacker News",
  "Reddit",
  "Friend / Colleague",
  "YouTube",
  "Podcast",
  "GitHub",
  "Search Engine",
  "Newsletter",
  "Conference / Meetup",
  "Other",
] as const;

export type VibeCodingTool = (typeof VIBE_CODING_TOOLS)[number];
export type MacModel = (typeof MAC_MODELS)[number];
export type JobRole = (typeof JOB_ROLES)[number];
