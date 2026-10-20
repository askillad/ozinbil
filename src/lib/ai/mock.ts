import type { CareerReport } from "./schema";

/** Returned when ANTHROPIC_API_KEY is not set, so the UI can be explored without a key. */
export const mockReport: CareerReport = {
  archetype: "Analyst-Creator",
  summary:
    "You combine structured thinking with a strong drive to create. You enjoy complex problems, but you want to see how your work helps real people. Roles at the intersection of data, product and design suit you best.",
  traits: [
    { name: "Analytical", score: 86 },
    { name: "Creative", score: 74 },
    { name: "Social", score: 58 },
    { name: "Technical", score: 81 },
    { name: "Entrepreneurial", score: 49 },
    { name: "Organizational", score: 63 },
  ],
  matches: [
    { title: "Product Analyst", matchScore: 92, why: "You love finding patterns and care about the end user.", demand: "high", salaryRange: "500 000 – 1 200 000 ₸" },
    { title: "UX Researcher", matchScore: 85, why: "Research depth plus empathy for people.", demand: "medium", salaryRange: "450 000 – 1 000 000 ₸" },
    { title: "Data Scientist", matchScore: 79, why: "Strong math and curiosity about how systems work.", demand: "high", salaryRange: "600 000 – 1 500 000 ₸" },
    { title: "Product Manager", matchScore: 71, why: "You see the big picture, but leadership is still a growth area.", demand: "high", salaryRange: "700 000 – 1 800 000 ₸" },
  ],
  strengths: [
    { title: "Systems thinking", description: "You break problems into parts and see connections." },
    { title: "Curiosity", description: "You dig into topics until you understand them deeply." },
    { title: "User empathy", description: "You care whether your work is genuinely useful." },
  ],
  growthAreas: [
    { title: "Public speaking", description: "You tend to avoid presenting your ideas.", tip: "Present one mini-insight to friends or classmates every week." },
    { title: "Finishing projects", description: "Ideas come faster than they get completed.", tip: "Time-box projects to 2 weeks and publish the result." },
  ],
  skills: {
    hard: [
      { name: "SQL", current: 20, target: 85 },
      { name: "Python (pandas)", current: 30, target: 75 },
      { name: "Statistics & A/B tests", current: 35, target: 80 },
      { name: "BI tools (Tableau / Power BI)", current: 10, target: 70 },
    ],
    soft: [
      { name: "Communication", current: 50, target: 80 },
      { name: "Critical thinking", current: 75, target: 90 },
      { name: "Time management", current: 45, target: 75 },
    ],
  },
  categoryAdvice: {
    title: "Next steps for you",
    items: ["UNT profile: Mathematics + Informatics", "Look at programs in IT and applied math with state grants", "Join a data olympiad or hackathon this year"],
  },
  roadmap: [
    { title: "Foundations", duration: "1–2 months", actions: ["Learn SQL basics", "Refresh statistics"], resources: ["Stepik: Interactive SQL trainer", "Khan Academy: Statistics"] },
    { title: "Tools", duration: "2–3 months", actions: ["Python + pandas", "Build 2 dashboards on open data"], resources: ["Kaggle Learn", "data.egov.kz open datasets"] },
    { title: "Portfolio", duration: "2 months", actions: ["3 case studies on GitHub", "Write about one on LinkedIn"], resources: ["GitHub", "LinkedIn"] },
    { title: "First job", duration: "1–2 months", actions: ["Apply to 30+ junior / intern roles", "Practice case interviews"], resources: ["hh.kz", "Glassdoor interview questions"] },
  ],
};
