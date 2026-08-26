import { faqCategories } from "@/content/faq";
import { ldJson } from "@/lib/ld-json";

/**
 * FAQPage markup, drawn from the real help centre.
 *
 * When Google accepts this, the search result grows an expandable list of
 * questions underneath it — it takes up several times the vertical space of a
 * plain result and answers the visitor's objection before they even click.
 *
 * Only a handful of questions are included. Google ignores enormous FAQ blocks,
 * and these are the ones a stranger deciding whether to pay actually asks.
 */
const WANTED = [
  "سعر الاشتراك كام؟",
  "أقدر أجرّب قبل ما أدفع؟",
  "لو اشتركت، بياخد كل المسارات ولا واحد؟",
  "الاشتراك ده شهري؟",
  "محتاج خبرة سابقة عشان أبدأ؟",
  "كام دقيقة محتاج يوميًا؟",
  "فيه شهادة في الآخر؟",
  "الدفع بيتم إزاي؟",
];



export default function FaqSchema() {
  const all = faqCategories.flatMap((c) => c.items);

  const picked = WANTED.map((q) => all.find((item) => item.q === q)).filter(
    (x): x is NonNullable<typeof x> => Boolean(x)
  );

  if (picked.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: ldJson({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: picked.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }),
      }}
    />
  );
}
