export const COURSE_IDS = ["foundation", "masterclass", "advance"] as const;

export type CourseId = (typeof COURSE_IDS)[number];

export type CourseCatalogItem = {
  id: CourseId;
  title: string;
  subtitle: string;
  amount: string;
  currency: string;
  available: boolean;
};

export const COURSE_CATALOG: Record<CourseId, CourseCatalogItem> = {
  foundation: {
    id: "foundation",
    title: "Foundation Course",
    subtitle: "Master the Fundamentals",
    amount: "25",
    currency: "usd",
    available: true,
  },
  masterclass: {
    id: "masterclass",
    title: "Masterclass Program",
    subtitle: "Advanced Strategies & Methods",
    amount: "885",
    currency: "usd",
    available: true,
  },
  advance: {
    id: "advance",
    title: "Advance Program",
    subtitle: "Institutional Precision",
    amount: "225",
    currency: "usd",
    available: true,
  },
};

export function getCourseById(courseId: string): CourseCatalogItem | undefined {
  if (!(courseId in COURSE_CATALOG)) {
    return undefined;
  }

  return COURSE_CATALOG[courseId as CourseId];
}

export function listAvailableCourses(): CourseCatalogItem[] {
  return Object.values(COURSE_CATALOG).filter((course) => course.available);
}
