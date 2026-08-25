import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function LearnPage() {
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-xl font-bold mb-1">الذكاء الاصطناعي والتقنية</h1>
      <p className="text-sm text-neutral-500 mb-4">أتقن أدوات الذكاء الاصطناعي وابنِ مصدر دخل جديد</p>

      <div className="flex gap-2 mb-6 text-xs">
        <span className="bg-brand-50 text-brand-800 rounded-full px-3 py-1 font-bold">
          {courses.length} كورس
        </span>
      </div>

      <p className="text-xs text-neutral-400 mb-2 tracking-wide">كل الكورسات</p>
      <div className="space-y-3 mb-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={course.isComingSoon ? "#" : `/app/learn/${course.slug}`}
            className={`flex items-center gap-3 rounded-2xl bg-white border border-black/5 p-3 ${
              course.isComingSoon ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-xl shrink-0">
              {course.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{course.title}</span>
                {course.badge && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 rounded-full px-2 py-0.5 shrink-0">
                    {course.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 truncate mt-0.5">{course.description}</p>
              <p className="text-[10px] text-neutral-400 mt-1">
                {course.totalLessons} درس · {course.totalXp} XP
              </p>
            </div>
            {course.isComingSoon && (
              <span className="text-[10px] text-neutral-400 shrink-0">قريبًا</span>
            )}
          </Link>
        ))}
      </div>

    </div>
  );
}
