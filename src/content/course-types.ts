export type LessonCard = { heading: string; lines: string[]; tools?: string[] };
export type QuizQuestion = {
  type: "mcq" | "tf";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};
export type LessonTask = { instructions: string[]; prompt?: string };
export type LessonContent = {
  day: number;
  title: string;
  durationMin: number;
  xp: number;
  isCheckpoint?: boolean;
  cards: LessonCard[];
  task: LessonTask;
  quiz: QuizQuestion[];
};
export type ModuleContent = {
  title: string;
  description: string;
  icon: string;
  lessons: LessonContent[];
};
export type CourseMeta = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  badge?: string;
  level: string;
  accentFrom: string;
  accentTo: string;
};
export type CourseDefinition = {
  meta: CourseMeta;
  modules: ModuleContent[];
};
