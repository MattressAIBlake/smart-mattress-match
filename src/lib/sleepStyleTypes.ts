// Sleep Style Personality Types for Dating Quiz

export interface SleepStyleQuestion {
  id: string;
  question: string;
  emoji: string;
  options: {
    id: string;
    label: string;
    emoji: string;
    value: string;
  }[];
}

export interface SleepPersonality {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  traits: string[];
  compatibleWith: string[];
  redFlags: string[];
  datingAppPitch: string;
}

export const SLEEP_STYLE_QUESTIONS: SleepStyleQuestion[] = [
  {
    id: "position",
    question: "How do you sleep?",
    emoji: "🛏️",
    options: [
      { id: "back", label: "On my back", emoji: "😌", value: "back" },
      { id: "side", label: "Side sleeper", emoji: "🤗", value: "side" },
      { id: "stomach", label: "Face down", emoji: "😴", value: "stomach" },
      { id: "starfish", label: "All over the place", emoji: "⭐", value: "starfish" },
    ],
  },
  {
    id: "temperature",
    question: "Temperature check - you run...",
    emoji: "🌡️",
    options: [
      { id: "hot", label: "Always hot", emoji: "🔥", value: "hot" },
      { id: "cold", label: "Always cold", emoji: "🧊", value: "cold" },
      { id: "neutral", label: "Just right", emoji: "✨", value: "neutral" },
      { id: "variable", label: "Depends on the night", emoji: "🌙", value: "variable" },
    ],
  },
  {
    id: "space",
    question: "Bed real estate - you...",
    emoji: "📏",
    options: [
      { id: "sprawl", label: "Need all the space", emoji: "🏖️", value: "sprawl" },
      { id: "cuddle", label: "Love to cuddle", emoji: "🤗", value: "cuddle" },
      { id: "boundary", label: "Stay in my lane", emoji: "✅", value: "boundary" },
      { id: "wanderer", label: "Start cuddle, end sprawl", emoji: "🌊", value: "wanderer" },
    ],
  },
  {
    id: "covers",
    question: "Cover situation...",
    emoji: "🛌",
    options: [
      { id: "hog", label: "I hog them (sorry)", emoji: "😈", value: "hog" },
      { id: "share", label: "Share nicely", emoji: "😇", value: "share" },
      { id: "minimal", label: "Don't need covers", emoji: "🔥", value: "minimal" },
      { id: "burrito", label: "Burrito wrap only", emoji: "🌯", value: "burrito" },
    ],
  },
  {
    id: "sounds",
    question: "Sleep sounds?",
    emoji: "🔊",
    options: [
      { id: "silence", label: "Total silence", emoji: "🤫", value: "silence" },
      { id: "white-noise", label: "White noise/fan", emoji: "💨", value: "white-noise" },
      { id: "tv", label: "TV/music on", emoji: "📺", value: "tv" },
      { id: "breathing", label: "Partner's breathing 😏", emoji: "💕", value: "breathing" },
    ],
  },
];

export const SLEEP_PERSONALITIES: Record<string, SleepPersonality> = {
  "the-cool-cocoon": {
    id: "the-cool-cocoon",
    name: "The Cool Cocoon",
    emoji: "🧊",
    tagline: "Icy exterior, warm heart",
    description: "You're the person who keeps the AC at arctic levels and sleeps under 3 blankets. Your ideal partner? Someone who won't complain when you open the window in January.",
    traits: ["Always cold", "Blanket hoarder", "Window cracker", "Cuddle enthusiast"],
    compatibleWith: ["the-furnace", "the-zen-sleeper"],
    redFlags: ["Will steal all blankets", "Window will be open year-round", "May spoon you for warmth without consent"],
    datingAppPitch: "Looking for someone to keep me warm 🥶 Must tolerate 65°F bedroom temps.",
  },
  "the-furnace": {
    id: "the-furnace",
    name: "The Furnace",
    emoji: "🔥",
    tagline: "Human space heater",
    description: "You radiate heat like a small sun. Your exes have all said 'Why is it so hot in here?' Your perfect match? Someone who's always cold and loves free heating.",
    traits: ["Natural heater", "Minimal covers", "Fan required", "Saves on heating bills"],
    compatibleWith: ["the-cool-cocoon", "the-zen-sleeper"],
    redFlags: ["Will kick off all covers", "AC bill might double", "Cuddling is a sauna experience"],
    datingAppPitch: "Never pay for heating again 🔥 I'm a certified human furnace.",
  },
  "the-starfish": {
    id: "the-starfish",
    name: "The Starfish",
    emoji: "⭐",
    tagline: "All limbs, all directions",
    description: "You sleep like you're making snow angels - arms and legs everywhere. You need a California King just for yourself. Your perfect match? Someone patient who doesn't mind waking up with your foot on their face.",
    traits: ["Sprawls everywhere", "Unconscious ninja", "Needs space", "Dynamic sleeper"],
    compatibleWith: ["the-boundary-keeper", "the-zen-sleeper"],
    redFlags: ["Will take up 80% of bed", "May accidentally hit you", "King bed is non-negotiable"],
    datingAppPitch: "Athletic even in sleep ⭐ Seeking patient co-pilot for this wild ride.",
  },
  "the-boundary-keeper": {
    id: "the-boundary-keeper",
    name: "The Boundary Keeper",
    emoji: "✅",
    tagline: "Respects the invisible line",
    description: "You sleep on your side of the bed and never cross the middle. Neat, tidy, predictable. Your perfect match? Someone who appreciates personal space or a starfish who needs a grounding force.",
    traits: ["Stays in lane", "Organized", "Respectful", "Consistent"],
    compatibleWith: ["the-starfish", "the-cuddle-monster"],
    redFlags: ["Might seem distant", "Don't expect spontaneous cuddling", "Will notice if you cross the line"],
    datingAppPitch: "Respectful of space ✅ Looking for balance - your chaos, my order.",
  },
  "the-cuddle-monster": {
    id: "the-cuddle-monster",
    name: "The Cuddle Monster",
    emoji: "🤗",
    tagline: "Professional little spoon",
    description: "You fall asleep cuddling and wake up cuddling. Personal space? Never heard of her. Your perfect match? Someone who loves physical touch and doesn't mind being koala'd.",
    traits: ["Always touching", "Affectionate", "Needs connection", "Excellent spooner"],
    compatibleWith: ["the-boundary-keeper", "the-zen-sleeper"],
    redFlags: ["Will be offended if you roll away", "Your arm will fall asleep", "May follow you around the bed"],
    datingAppPitch: "Certified cuddle expert 🤗 Warning: extremely affectionate.",
  },
  "the-zen-sleeper": {
    id: "the-zen-sleeper",
    name: "The Zen Sleeper",
    emoji: "🧘",
    tagline: "Perfectly balanced",
    description: "You're the Goldilocks of sleep - not too hot, not too cold, not too cuddly, not too distant. You're adaptable and easy to sleep next to. Your perfect match? Literally anyone, you flexible gem.",
    traits: ["Adaptable", "Easy-going", "Temperature neutral", "Flexible"],
    compatibleWith: ["the-furnace", "the-cool-cocoon", "the-starfish", "the-cuddle-monster"],
    redFlags: ["Might be too perfect (suspicious)", "Could be hiding secret starfish tendencies", "May not have strong opinions on thread count"],
    datingAppPitch: "Low-maintenance sleep partner 🧘 Adaptable to your chaos.",
  },
  "the-night-owl": {
    id: "the-night-owl",
    name: "The Night Owl",
    emoji: "🦉",
    tagline: "3am is my prime time",
    description: "You're most alive when everyone else is asleep. Netflix, snacks, existential thoughts - all happening at 2am. Your perfect match? An early bird who won't judge your reverse schedule or another owl for midnight adventures.",
    traits: ["Late sleeper", "Active at night", "Creative hours", "Quiet mornings"],
    compatibleWith: ["the-early-bird", "the-zen-sleeper"],
    redFlags: ["Will wake you up at 3am with phone brightness", "Breakfast dates? Not happening", "May reorganize closet at midnight"],
    datingAppPitch: "Nocturnal creature 🦉 Looking for someone who won't judge my 4am snacks.",
  },
  "the-early-bird": {
    id: "the-early-bird",
    name: "The Early Bird",
    emoji: "🌅",
    tagline: "5am is sleeping in",
    description: "You wake up with the sun (sometimes before it). Morning person doesn't even begin to cover it. Your perfect match? A night owl for balance, or another early bird for 6am hikes.",
    traits: ["Morning energy", "Early riser", "Productive AM", "Asleep by 9pm"],
    compatibleWith: ["the-night-owl", "the-zen-sleeper"],
    redFlags: ["Will be annoyingly chipper at dawn", "Weekends mean 7am activities", "Goes silent after 9pm"],
    datingAppPitch: "Rise and grind mentality 🌅 Let's catch sunrise together (seriously).",
  },
};

// Algorithm to determine personality type based on answers
export function calculateSleepPersonality(answers: Record<string, string>): string {
  const { position, temperature, space, covers, sounds } = answers;

  // Temperature-based personalities
  if (temperature === "cold" && covers === "hog") {
    return "the-cool-cocoon";
  }
  if (temperature === "hot" && covers === "minimal") {
    return "the-furnace";
  }

  // Space-based personalities
  if (space === "sprawl" && position === "starfish") {
    return "the-starfish";
  }
  if (space === "boundary") {
    return "the-boundary-keeper";
  }
  if (space === "cuddle" || space === "wanderer") {
    return "the-cuddle-monster";
  }

  // Sound/timing-based personalities
  if (sounds === "tv" || sounds === "white-noise") {
    return "the-night-owl";
  }
  if (sounds === "silence" && space === "boundary") {
    return "the-early-bird";
  }

  // Default to zen if adaptable answers
  if (temperature === "neutral" || temperature === "variable") {
    return "the-zen-sleeper";
  }

  // Fallback
  return "the-zen-sleeper";
}

export function getCompatibilityScore(type1: string, type2: string): number {
  const personality1 = SLEEP_PERSONALITIES[type1];
  const personality2 = SLEEP_PERSONALITIES[type2];

  if (!personality1 || !personality2) return 50;

  // Perfect match
  if (personality1.compatibleWith.includes(type2)) {
    return Math.floor(Math.random() * 15) + 85; // 85-100%
  }

  // Same type compatibility
  if (type1 === type2) {
    // Some types work great together, others not so much
    if (["the-zen-sleeper", "the-boundary-keeper"].includes(type1)) {
      return Math.floor(Math.random() * 10) + 80; // 80-90%
    }
    if (["the-starfish", "the-cuddle-monster"].includes(type1)) {
      return Math.floor(Math.random() * 20) + 40; // 40-60%
    }
  }

  // Default compatibility
  return Math.floor(Math.random() * 30) + 50; // 50-80%
}

export function getCompatibilityInsights(type1: string, type2: string): string[] {
  const personality1 = SLEEP_PERSONALITIES[type1];
  const personality2 = SLEEP_PERSONALITIES[type2];

  const insights: string[] = [];

  // Temperature insights
  if ((type1 === "the-furnace" && type2 === "the-cool-cocoon") ||
      (type1 === "the-cool-cocoon" && type2 === "the-furnace")) {
    insights.push("🔥❄️ Perfect temperature balance - one's a heater, one's always cold!");
  }

  // Space insights
  if ((type1 === "the-starfish" && type2 === "the-boundary-keeper") ||
      (type1 === "the-boundary-keeper" && type2 === "the-starfish")) {
    insights.push("⭐✅ Good balance - starfish gets space, boundary keeper stays organized!");
  }

  // Cuddle insights
  if (type1 === "the-cuddle-monster" && type2 === "the-cuddle-monster") {
    insights.push("🤗🤗 Double cuddle monsters! You'll never be apart... like, ever.");
  }

  // Schedule insights
  if ((type1 === "the-night-owl" && type2 === "the-early-bird") ||
      (type1 === "the-early-bird" && type2 === "the-night-owl")) {
    insights.push("🦉🌅 Opposite schedules - you'll have the bed to yourselves at different times!");
  }

  // Same type warnings
  if (type1 === type2 && type1 === "the-starfish") {
    insights.push("⭐⭐ Two starfish = California King mandatory. Seriously.");
  }

  if (type1 === type2 && type1 === "the-furnace") {
    insights.push("🔥🔥 Two furnaces = AC bill through the roof. Worth it?");
  }

  // Add default if no specific insights
  if (insights.length === 0) {
    insights.push("✨ Your sleep styles are unique - embrace the adventure!");
  }

  return insights;
}
