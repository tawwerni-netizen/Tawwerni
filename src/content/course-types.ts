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
  /**
   * What the learner can do at the end — concrete enough to be checked.
   *
   * “You will get a certificate” answers nothing: the buyer wants to know what
   * changes about them. Every line here is drawn from lessons that exist, and
   * is phrased as an action they can attempt on day 29 and see for themselves.
   */
  outcomes: string[];
  /**
   * The ceiling, stated out loud.
   *
   * A 28-day course at five minutes a day does not produce an expert, and
   * pretending otherwise is the promise that gets refunded. Naming the limit
   * costs one line and buys the credibility of everything above it.
   */
  reality: string;
  accentFrom: string;
  accentTo: string;
};
export type CourseDefinition = {
  meta: CourseMeta;
  modules: ModuleContent[];
};
