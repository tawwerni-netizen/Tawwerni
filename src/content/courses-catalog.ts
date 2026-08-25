export type ComingSoonCourse = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  badge?: string;
  totalLessons: number;
  totalXp: number;
  level: string;
};

export const comingSoonCourses: ComingSoonCourse[] = [];
