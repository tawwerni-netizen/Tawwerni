export type FaqItem = { q: string; a: string; qEn?: string; aEn?: string };
export type FaqCategory = { key: string; title: string; titleEn: string; icon: string; items: FaqItem[] };

/**
 * The official Tawwerni Help Center (Bilingual Arabic & English).
 * Contains comprehensive answers covering Getting Started, the 100 New Tracks,
 * 1-Year Membership, Learning Mechanics, Security, Certificates, and Track Deep Dives.
 */
export const faqCategories: FaqCategory[] = [
  {
    "key": "getting-started",
    "title": "البداية والتسجيل",
    "titleEn": "Getting Started & Account Setup",
    "icon": "🚀",
    "items": [
      {
        "q": "إزاي أبدأ في المنصة؟",
        "qEn": "How do I get started on Tawwerni?",
        "a": "اعمل حساب بإيميلك وكلمة سر، وهتلاقي اليوم الأول من كل مسار مفتوح مجانًا على طول. لو عجبك، ادفع 349 جنيه وابعتلنا إثبات التحويل، وهنفتحلك كل المسارات الـ 100 خلال دقائق على الأكثر.",
        "aEn": "Sign up with your email and password, and Day 1 of all 100 courses is immediately unlocked for free. When you're ready, pay 349 EGP and send us transfer proof to unlock all 100 tracks permanently."
      },
      {
        "q": "إزاي أعمل حساب؟",
        "qEn": "How do I create an account?",
        "a": "من صفحة تسجيل الدخول دوس \"اعمل حساب\"، واكتب اسمك وإيميلك ورقم موبايلك وكلمة سر من 8 حروف على الأقل. الحساب بيتفتح فورًا من غير انتظار.",
        "aEn": "From the sign-in page, click 'Create Account', enter your name, email, phone number, and a password of at least 8 characters. Your account activates immediately with zero waiting."
      },
      {
        "q": "الدخول بيكون إزاي؟",
        "qEn": "How do I log in?",
        "a": "بالإيميل وكلمة السر اللي اخترتها وقت التسجيل. مفيش أكواد بتتبعت ولا انتظار — بتكتبهم وتدخل.",
        "aEn": "Log in with the email and password you set during registration. No waiting for magic codes — just enter your credentials and begin."
      },
      {
        "q": "محتاج خبرة سابقة عشان أبدأ؟",
        "qEn": "Do I need prior experience before starting?",
        "a": "لأ خالص. كل المسارات مصممة تبدأ من الصفر، وأول أسبوع في أي مسار أساسيات مبسّطة جدًا.",
        "aEn": "Not at all. Every track is built from absolute ground zero, with the first week focusing on simplified foundational concepts."
      },
      {
        "q": "أقدر أجرّب قبل ما أدفع؟",
        "qEn": "Can I try before I pay?",
        "a": "أيوة. اليوم الأول من كل مسار مفتوح مجانًا لأي حساب. يعني تقدر تجرّب درس كامل من كل مسار من غير ما تدفع مليم.",
        "aEn": "Yes! Day 1 of every single course is completely free for all users. You can experience full lessons across multiple tracks before investing anything."
      },
      {
        "q": "المنصة دي لمين بالظبط؟",
        "qEn": "Who is this platform designed for?",
        "a": "لأي حد عايز يطوّر مهارة حقيقية بشكل يومي منظم — موظفين، أصحاب مشاريع، طلبة، أو أي حد حاسس إنه محتاج نظام واضح بدل المحتوى المبعثر.",
        "aEn": "Anyone committed to building real high-demand skills in a structured daily rhythm — employees, entrepreneurs, students, and ambitious learners seeking clarity."
      },
      {
        "q": "لازم أخلّص المسار في 28 يوم بالظبط؟",
        "qEn": "Do I have to finish the track in exactly 28 days?",
        "a": "لأ. الـ28 يوم هي الوتيرة المقترحة، بس الوصول عندك لمدة سنة. تقدر تاخد وقتك.",
        "aEn": "No. 28 days is the recommended daily cadence, but you have 1-year access. You can learn at your own pace and revisit lessons whenever you want."
      },
      {
        "q": "أقدر أبدأ أكتر من مسار في نفس الوقت؟",
        "qEn": "Can I learn multiple tracks simultaneously?",
        "a": "اشتراكك بيفتحلك كل المسارات، فتقدر. بس ننصح تركز على واحد لحد ما تخلّصه — التشتت بين مسارين بيقلل الاستمرارية.",
        "aEn": "Your subscription unlocks all 100 tracks, so yes! However, we recommend focusing on one primary track to build momentum before branching out."
      },
      {
        "q": "إيه الفرق بين المسارات؟",
        "qEn": "What is the difference between tracks?",
        "a": "المنصة بتضم 100 مسار احترافي موزعين على 10 أركان حيوية: الذكاء الاصطناعي، البرمجة وتطوير الويب، تحليل البيانات، العمل الحر، التسويق الرقمي، التصميم الإبداعي، ريادة الأعمال، الأمن السيبراني، المهارات القيادية، والإنتاجية وإدارة الذات. اشتراك واحد يفتحلك كل الـ 100 مسار دفعة واحدة لمدة سنة.",
        "aEn": "The catalog features 100 tracks across 10 vital disciplines: AI, Web Dev, Data, Freelancing, Marketing, UI/UX, Business, Cybersecurity, Leadership, and Productivity. One single membership unlocks everything."
      },
      {
        "q": "أنهي مسار أبدأ بيه؟",
        "qEn": "Which track should I start with?",
        "a": "لو محتار: ابدأ بمسار الذكاء الاصطناعي — ده أكتر مسار بيدي نتيجة سريعة تحسّها في شغلك. لو عايز الأساس اللي كل حاجة بتتبني عليه، ابدأ بـ\"نمط النجاح\".",
        "aEn": "If in doubt, start with ChatGPT & AI Prompting — it delivers the fastest return on investment in your daily work. If you want mental foundations, start with Success Mindset."
      },
      {
        "q": "المسارات دي فيديوهات؟",
        "qEn": "Are these video courses?",
        "a": "لأ. المسارات نصية تفاعلية — بطاقات قصيرة تقراها، مهمة عملية تنفذها، وكويز يثبّت المعلومة. أسرع وأثبت من الفيديو.",
        "aEn": "No. They are interactive micro-lessons: bite-sized cards, actionable 5-minute tasks, and active-recall quizzes. Faster, more practical, and stickier than passive video."
      },
      {
        "q": "الكورس بالعربي ولا الإنجليزي؟",
        "qEn": "Are the courses in Arabic or English?",
        "a": "المحتوى بالكامل ثنائي اللغة (عربي وإنجليزي). تقدر تبدّل اللغة بنقرة زرار من أي مكان في المنصة، مع شرح المصطلحات التقنية العالمية والمحلية بدقة.",
        "aEn": "All content is 100% bilingual in clean Arabic and pure English. You can switch languages with a single click anywhere on the platform."
      },
      {
        "q": "المحتوى بيتحدّث؟",
        "qEn": "Is the content regularly updated?",
        "a": "أيوة. بنضيف دروس ومحتوى جديد بشكل مستمر، والتحديثات بتوصلك مجانًا من غير أي دفع إضافي.",
        "aEn": "Yes. We update and add new lessons constantly, and all updates are completely free for all members with zero extra charges."
      },
      {
        "q": "أقدر أشوف محتوى المسار قبل ما أشتري؟",
        "qEn": "Can I view the curriculum before subscribing?",
        "a": "أيوة. في صفحة كل مسار هتلاقي قائمة كاملة بالأيام بعناوينها والمدة والوحدات، عشان تعرف بالظبط هتتعلم إيه.",
        "aEn": "Yes! Every track page displays the complete day-by-day curriculum with titles, durations, modules, and learning outcomes."
      },
      {
        "q": "كام دقيقة محتاج يوميًا؟",
        "qEn": "How many minutes are required daily?",
        "a": "من 5 لـ15 دقيقة حسب اليوم. تقدر تحدد وتيرتك من صفحة حسابك.",
        "aEn": "Between 5 and 15 minutes depending on the day. You can customize your daily pace in your profile settings."
      },
      {
        "q": "لو فاتني يوم أو أكتر؟",
        "qEn": "What happens if I miss a day or two?",
        "a": "مفيش مشكلة، مفيش عقوبة. بس السلسلة (streak) هتبدأ من الأول. المهم ترجع، مش إنك تكون مثالي.",
        "aEn": "No penalty at all. Your streak resets, but you can pick up right where you left off. Consistency matters far more than perfection."
      },
      {
        "q": "المنصة شغالة على الموبايل؟",
        "qEn": "Does the platform work on mobile?",
        "a": "أيوة، المنصة مصممة أساسًا للموبايل وشغالة بنفس الكفاءة على الكمبيوتر والتابلت.",
        "aEn": "Yes! Tawwerni is engineered mobile-first and works seamlessly on mobile phones, tablets, and desktop computers."
      },
      {
        "q": "لازم أدخل كل يوم في نفس الميعاد؟",
        "qEn": "Do I have to log in at the exact same time every day?",
        "a": "مش لازم، بس بينجح أكتر. ربط الدرس بحاجة بتعملها كل يوم أصلًا (القهوة، المواصلات، قبل النوم) بيخلي الاستمرار أسهل بكتير.",
        "aEn": "Not required, but anchoring your 5-minute lesson to an existing daily ritual (like morning coffee or commute) makes consistency effortless."
      },
      {
        "q": "أقدر أغيّر الوتيرة اليومية بعدين؟",
        "qEn": "Can I adjust my daily pace later?",
        "a": "أيوة، من صفحة \"حسابي\" في أي وقت. اختار 5 أو 10 أو 15 دقيقة حسب ظروفك.",
        "aEn": "Yes, anytime from your Profile page. Choose between 5, 10, or 15 minutes per day."
      },
      {
        "q": "مفيش أي حاجة لازم أنزّلها؟",
        "qEn": "Do I need to download any apps?",
        "a": "لأ. المنصة كلها بتشتغل من المتصفح. تقدر تضيفها لشاشة موبايلك الرئيسية وتفتحها زي أي تطبيق.",
        "aEn": "No app installation required. Tawwerni runs directly in your browser and can be installed to your home screen with one tap as a PWA."
      }
    ]
  },
  {
    "key": "tracks-100",
    "title": "الـ 100 مسار الجديد (الكتالوج الشامل)",
    "titleEn": "The 100 New Tracks (Master Catalog)",
    "icon": "🌟",
    "items": [
      {
        "q": "إيه هي مكتبة الـ 100 مسار الجديدة المضافة للمنصة؟",
        "qEn": "What is the new 100-track master catalog on Tawwerni?",
        "a": "الـ 100 مسار هي منظومة تدريبية مهارية شاملة تغطي كافة مجالات العمل والمستقبل الأكثر طلباً، مقسمة على 10 أركان حيوية: الذكاء الاصطناعي، البرمجة وتطوير البرمجيات، تحليل البيانات والذكاء التجاري، العمل الحر والوكالات، التسويق والنمو، التصميم الإبداعي والوسائط، ريادة الأعمال وبناء المشاريع، الأمن السيبراني والخصوصية، المهارات القيادية والتفاوض، والإنتاجية وإدارة الذات. كل مسار يضم 20 إلى 28 درساً تطبيقياً.",
        "aEn": "The 100 tracks represent a comprehensive curriculum covering modern high-demand skills across 10 vital disciplines: AI & Prompting, Software & Web Development, Data Analytics, Freelancing & Agencies, Digital Marketing & Growth, Creative Design & Media, Entrepreneurship & Startups, Cybersecurity & Privacy, Leadership & Negotiation, and Peak Productivity. Each track contains 20 to 28 actionable lessons."
      },
      {
        "q": "هل اشتراك واحد يفتح لي كل الـ 100 مسار بالكامل؟",
        "qEn": "Does a single membership truly unlock all 100 tracks?",
        "a": "نعم تماماً وبدون أي اشتراكات متكررة! باشتراك رمزي لمرة واحدة (349 ج.م فقط) تحصل على وصول لمدة سنة لكافة الـ 100 مسار بجميع دروسها، مهامها العملية، كويزاتها التفاعلية، وشهادات إتمامها.",
        "aEn": "Yes, absolutely with zero recurring fees! A single one-time payment of 349 EGP unlocks 1-year access to all 100 tracks, including every lesson, practical task, interactive quiz, and completion certificate for a full year."
      },
      {
        "q": "هل أحصل على شهادة معتمدة لكل مسار من الـ 100؟",
        "qEn": "Do I receive a verified certificate for each of the 100 tracks?",
        "a": "نعم! لكل مسار من الـ 100 مسار شهادة إتمام خاصة به تحمل كود تحقق رسمي فريد ورابط فحص علني (/verify/[code]). بمجرد إتمام دروس المسار بنجاح، تفتح شهادتك المعتمدة مباشرة باللغتين العربية والإنجليزية.",
        "aEn": "Yes! Every single track in the 100-course catalog includes an independent completion certificate with a unique verification code and public validation link (/verify/[code]). Once you finish a track, your certificate unlocks instantly in both English and Arabic."
      },
      {
        "q": "إزاي أتنقل وأبدل بين الـ 100 مسار؟",
        "qEn": "How do I switch and navigate between different tracks?",
        "a": "بحرية تامة في أي وقت! من صفحة 'المسارات' (Tracks) أو 'تعلّم' (Learn) يمكنك بدء أي مسار وتصفح محتواه. تقدمك ونقاط خبرتك (XP) والدروس المكتملة في كل مسار تُحفظ تلقائياً وبشكل مستقل على حسابك.",
        "aEn": "With complete freedom at any time! From the Tracks catalog or Learn tab, you can start any course and explore its syllabus. Your progress, completions, and earned XP for each course are saved independently on your profile."
      },
      {
        "q": "أبدأ بأنهي مسار من بين الـ 100 مسار؟",
        "qEn": "Which course should I begin with among the 100 tracks?",
        "a": "إذا كنت محتاراً، ابدأ بمسار 'هندسة الأوامر والذكاء الاصطناعي اليومي' أو 'العمل الحر واقتناص العملاء'. وإذا أردت ترشيحاً مخصصاً، خُض اختبار تحديد المسار (/quiz) وسيقترح عليك المسار الأنسب لطموحك وخبرتك.",
        "aEn": "If you're unsure, start with 'ChatGPT & Prompt Engineering Mastery' or 'Freelancing & Client Acquisition'. For a personalized recommendation tailored to your background, take our 2-minute Career Quiz (/quiz)."
      },
      {
        "q": "هل الكورسات مناسبة للمبتدئين بدون أي خلفية برمجية أو تقنية؟",
        "qEn": "Are the 100 courses suitable for total beginners with no technical background?",
        "a": "نعم، بنسبة 100%. كل مسار يبدأ من الصفر تماماً بدون افتراض أي معرفة مسبقة، ويأخذ بيدك خطوة بخطوة بلغة سهلة وأمثلة واقعية حتى الوصول لمستوى الاحتراف وصنع الدخل.",
        "aEn": "Yes, 100%. Every track starts from absolute ground zero with no technical prerequisites, guiding you step-by-step with accessible explanations and practical examples up to professional mastery."
      },
      {
        "q": "كام دقيقة يحتاجها كل درس في الـ 100 مسار؟",
        "qEn": "How many minutes does each daily lesson take across the 100 tracks?",
        "a": "من 5 إلى 15 دقيقة فقط يومياً! اعتمدنا أسلوب التعلم الميكرو (Micro-learning) المكثف: بطاقات تعليمية مركزة بدون حشو، مهمة عملية واحدة 5 دقائق، وكويز تفاعلي سريع لتثبيت المعلومة.",
        "aEn": "Only 5 to 15 minutes per day! We engineered all 100 courses using high-impact micro-learning: concise visual cards, one 5-minute actionable daily task, and a quick quiz to reinforce learning."
      },
      {
        "q": "هل محتوى الـ 100 كورس متاح باللغتين العربية والإنجليزية؟",
        "qEn": "Is all content across the 100 tracks fully bilingual in Arabic and English?",
        "a": "نعم! بنقرة واحدة على زر تبديل اللغة في أعلى الصفحة يمكنك التبديل بين العربية والإنجليزية. البطاقات والمهام والكويزات والشهادات ولوحة التحكم كلها ثنائية اللغة بالكامل 100%.",
        "aEn": "Yes! With a single click on the language toggle in the header, you can switch between English and Arabic. All cards, tasks, quizzes, certificates, and dashboard metrics are 100% bilingual."
      },
      {
        "q": "إزاي بيساعدني المدرب الذكي (فهيم) في كل كورس من الـ 100؟",
        "qEn": "How does the AI Coach (Faheem) assist me across all 100 tracks?",
        "a": "فهيم هو مدربك الذكي المتاح 24/7. يفهم سياق الدرس والمسار الذي تدرسه حالياً، يجيب عن تساؤلاتك، يوضح المصطلحات الصعبة، ويراجع معك حلول المهام العملية ويقدم لك تشجيعاً مستمراً.",
        "aEn": "Faheem is your 24/7 empathetic AI coach. He understands the exact lesson you are studying, clarifies complex technical concepts, reviews your daily exercises, and provides ongoing encouragement."
      },
      {
        "q": "هل التحديثات والمسارات الإضافية المستقبلية مجانية للمشتركين؟",
        "qEn": "Are future updates and additional courses included for free?",
        "a": "نعم! اشتراكك هو استثمار لمدة سنة، ويشمل جميع التحديثات الدورية على المسارات الـ 100، بالإضافة إلى أي مسارات جديدة يتم إطلاقها مستقبلاً بدون أي رسوم إضافية إطلاقاً.",
        "aEn": "Yes! 1-Year membership guarantees free access to all curriculum updates, refreshed tool guides, and brand-new tracks added to the catalog for a full year."
      },
      {
        "q": "هل أقدر أدرس وأتابع المسارات من الموبايل بسهولة؟",
        "qEn": "Can I study and complete the 100 tracks on my mobile phone?",
        "a": "المنصة مصممة بأولية كاملة للهواتف الذكية (Mobile-First) وتعمل بسلاسة فائقة من متصفح الهاتف أو الكمبيوتر أو التابلت، ويمكنك إضافتها لشاشتك الرئيسية كتطبيق PWA سريع.",
        "aEn": "Tawwerni is engineered mobile-first and runs flawlessly on any smartphone, tablet, or desktop browser. You can even install it to your home screen as a standalone web app."
      },
      {
        "q": "إزاي أصحاب العمل والشركات بيتحققوا من صحة الشهادة المعتمدة؟",
        "qEn": "How do employers verify the authenticity of my completion certificate?",
        "a": "تحمل كل شهادة رابط تحقق عام وكوداً خاصاً. يمكن لأي جهة أو مدير توظيف زيارة tawwerni.com/verify وإدخال الرمز لمشاهدة تفاصيل الطالب والمسار وتاريخ الإصدار والدروس المكتملة فورياً.",
        "aEn": "Every certificate features a unique public verification URL and verification code. Employers can visit tawwerni.com/verify to inspect your verified credential, track details, issue date, and completion score."
      },
      {
        "q": "هل أقدر أذاكر أكتر من درس في اليوم لو عندي وقت؟",
        "qEn": "Can I complete more than one lesson per day if I have extra time?",
        "a": "نعم بكل تأكيد! الوتيرة اليومية (5-15 دقيقة) هي حد أدنى مقترح للاستمرارية، لكن كل الدروس مفتوحة لك ويمكنك إنجاز درسين أو ثلاثة يومياً حسب رغبتك وسرعتك الشخصية.",
        "aEn": "Absolutely! The daily pace (5–15 mins) is a recommended baseline for consistency, but all unlocked lessons are available for you to accelerate and complete multiple lessons whenever you wish."
      },
      {
        "q": "إيه الفرق بين الكورسات النصية التفاعلية وكورسات الفيديو التقليدية؟",
        "qEn": "What is the advantage of interactive text-based tracks over traditional video courses?",
        "a": "الكورسات النصية التفاعلية أسرع 4 أضعاف في التعلم والتطبيق، تسمح لك بالبحث والنسخ والتجربة المباشرة دون إضاعة ساعات في مشاهدة كلام مكرر أو بطء التحميل، مع كويزات فورية تثبت الفهم.",
        "aEn": "Interactive text-based tracks are 4x faster to learn and apply. They allow you to search, copy practical blueprints, and execute immediately without wasting hours watching passive video lectures."
      },
      {
        "q": "هل أحتاج لدفع اشتراكات مدفوعة لأدوات الذكاء الاصطناعي المستخدمة؟",
        "qEn": "Do I need to pay for external AI subscriptions to complete the courses?",
        "a": "لا! جميع التطبيقات والمهام العملية في المسارات مصممة للعمل بكفاءة تامة باستخدام النسخ المجانية للأدوات (مثل ChatGPT، Claude، Canva، Google Sheets وغيرها)، مع شرح اختياري لمزايا النسخ المدفوعة لمن يرغب.",
        "aEn": "No! All practical tasks across the tracks are engineered to work 100% on free tiers of popular tools (ChatGPT, Claude, Canva, Google Workspace, etc.), with optional notes on paid features."
      }
    ]
  },
  {
    "key": "payment",
    "title": "الدفع والاشتراك",
    "titleEn": "Payment & 1-Year Membership",
    "icon": "💳",
    "items": [
      {
        "q": "سعر الاشتراك كام؟",
        "qEn": "What is the membership price?",
        "a": "349 جنيه فقط (بدل 1,200 جنيه)، دفعة واحدة، بتفتحلك كل الـ 100 مسار لمدة سنة — مش اشتراك شهري ومفيش أي تجديد تلقائي.",
        "aEn": "Only 349 EGP (discounted from 1,200 EGP) as a single one-time payment. It grants 1-year access to all 100 tracks with zero recurring fees."
      },
      {
        "q": "الدفع بيتم إزاي؟",
        "qEn": "What payment methods are supported?",
        "a": "فودافون كاش على أحد الرقمين: 01200176755 أو 01067558133. أو إنستاباي على hhifzy@instapay أو 01067558133.",
        "aEn": "Vodafone Cash or InstaPay (hhifzy@instapay or 01067558133 / 01200176755). Credit card support is also rolling out."
      },
      {
        "q": "دفعت، وبعدين إيه؟",
        "qEn": "I completed the payment, what next?",
        "a": "ابعتلنا سكرين شوت التحويل + الإيميل اللي هتستخدمه، على واتساب 01069999557 أو Tawwerni@gmail.com. هنفعّل حسابك خلال 24 ساعة.",
        "aEn": "Send your transfer screenshot and account email via WhatsApp to 01069999557 or Tawwerni@gmail.com. We activate your account within hours."
      },
      {
        "q": "ليه التفعيل يدوي مش تلقائي؟",
        "qEn": "Why is verification manual rather than instant?",
        "a": "لأننا بنستخدم محافظ إلكترونية مباشرة من غير بوابة دفع وسيطة — ده بيوفر عليك رسوم إضافية، بس بيحتاج مراجعة سريعة.",
        "aEn": "Using direct wallets without third-party gateway intermediaries saves you transaction fees while ensuring personalized onboarding."
      },
      {
        "q": "هستنى قد إيه لحد ما يتفعّل حسابي؟",
        "qEn": "How long until my account is activated?",
        "a": "عادة خلال ساعات قليلة، وبحد أقصى 24 ساعة. لو عدّت 24 ساعة، كلّمنا فورًا على واتساب.",
        "aEn": "Usually within 1 to 3 hours, and at most 24 hours. If 24 hours have elapsed, message us directly on WhatsApp."
      },
      {
        "q": "الاشتراك ده شهري؟",
        "qEn": "Is this a monthly subscription?",
        "a": "لأ. دفعة واحدة 349 جنيه فقط، ووصول لمدة سنة لكل الـ 100 مسار مع كل تحديثاتها وإضافاتها المستقبلية.",
        "aEn": "No. A single one-time payment of 349 EGP unlocks 1-year access to all 100 tracks with all future updates included."
      },
      {
        "q": "أقدر أدفع بفيزا؟",
        "qEn": "Can I pay with credit/debit card?",
        "a": "حاليًا فودافون كاش وإنستاباي بس. بنشتغل على إضافة الفيزا قريبًا.",
        "aEn": "Vodafone Cash and InstaPay are currently active. Card checkout options are in active rollout."
      },
      {
        "q": "لو اشتركت، بياخد كل المسارات ولا واحد؟",
        "qEn": "Does the payment unlock all tracks or just one?",
        "a": "كل المسارات. دفعة واحدة 349 جنيه وكل الـ 100 مسار بتتفتح على حسابك على طول، وأي مسار جديد ننزّله بعد كده كمان مجانًا.",
        "aEn": "All tracks! A single payment unlocks all 100 tracks immediately and permanently on your account."
      },
      {
        "q": "السعر هيفضل 349 ولا هيتغيّر؟",
        "qEn": "Will the price remain 349 EGP for a full year?",
        "a": "السعر الحالي (349 جنيه) هو عرض فوج التأسيس الأول (أول 500 مشترك) بدل السعر الأصلي 1,200 جنيه. اللي مضمون: لو اشتركت دلوقتي، وصولك لمدة سنة بنفس السعر اللي دفعته مهما زاد السعر بعد كده.",
        "aEn": "349 EGP is an early founder tier for the first 500 members. Once you enroll, your 1-year access is locked in regardless of future price increases."
      },
      {
        "q": "فيه استرجاع للفلوس؟",
        "qEn": "What is the refund policy?",
        "a": "مفيش استرجاع بعد الدفع — المحتوى رقمي وبيتفتح كامل على طول. عشان كده اليوم الأول من كل مسار مفتوح مجانًا قبل ما تدفع مليم: جرّب درس كامل من كل مسار، ولو مش عاجبك ما تدفعش.",
        "aEn": "We offer a 100% 14-day money-back guarantee. If you're not satisfied, message us within 14 days for a full refund."
      },
      {
        "q": "دفعت لرقم غلط، أعمل إيه؟",
        "qEn": "I transferred to the wrong number, what should I do?",
        "a": "ابعتلنا سكرين شوت التحويل على واتساب فورًا وهنشوف الموضوع معاك. الأرقام الصحيحة موضّحة في صفحة الدفع.",
        "aEn": "Send your transfer receipt to WhatsApp support immediately and our team will resolve it with you."
      },
      {
        "q": "الدفع آمن؟",
        "qEn": "Is payment safe and secure?",
        "a": "إحنا مش بنطلب منك أي بيانات بطاقة بنكية. التحويل بيتم من محفظتك مباشرة، وإحنا بس بنشوف إثبات التحويل.",
        "aEn": "100% secure. You transfer directly from your authorized bank app or mobile wallet. We never ask for or store card details."
      },
      {
        "q": "هل بتحتفظوا ببيانات بطاقتي؟",
        "qEn": "Do you store my financial information?",
        "a": "لأ نهائي. إحنا مش بنستقبل ولا بنخزّن أي بيانات بطاقات بنكية على الإطلاق — مفيش حقل بطاقة في الموقع أصلًا.",
        "aEn": "Never. We do not store, process, or have access to any banking PINs or card numbers."
      },
      {
        "q": "ليه مفيش استرجاع؟",
        "qEn": "Can I try before I pay?",
        "a": "لأن المحتوى بيتفتح كله فور التفعيل — مفيش جزء بيتقفل بعد كده. بدل ما نوعد بحاجة بعد الدفع، بنخليك تجرّب قبله: اليوم الأول من كل مسار مفتوح لأي حساب مجانًا.",
        "aEn": "Yes! Day 1 of all 100 tracks is completely free for every registered user without entering any payment information."
      },
      {
        "q": "أقدر أهدي الاشتراك لحد؟",
        "qEn": "Can I gift a membership to a friend or colleague?",
        "a": "أيوة. ادفع وابعتلنا إيميل الشخص اللي عايز تهديه، وهنفعّل الحساب باسمه.",
        "aEn": "Yes! Complete the transfer and send us the recipient's email address on WhatsApp, and we will activate their account directly."
      },
      {
        "q": "ليه بتطلبوا رقم الموبايل وقت الطلب؟",
        "qEn": "Why do you ask for a sender phone number during checkout?",
        "a": "عشان نطابق تحويلك بيه أوتوماتيك. لما التحويل يوصل من نفس الرقم بنفس المبلغ، حسابك بيتفعّل من غير انتظار مراجعة.",
        "aEn": "To automatically match your incoming Vodafone Cash or InstaPay transfer so your account can be verified rapidly."
      },
      {
        "q": "حوّلت من محفظة حد تاني، هيحصل إيه؟",
        "qEn": "What happens if I transfer from someone else's wallet?",
        "a": "التطابق التلقائي مش هيلاقي رقمك، فالطلب هيروح للمراجعة اليدوية. ابعتلنا على واتساب صورة التحويل وإيميلك وهنفعّلك بسرعة.",
        "aEn": "Simply share the transfer screenshot and your registered email on WhatsApp and we will manually verify your account."
      },
      {
        "q": "دفعت وحسابي لسه مقفول",
        "qEn": "I paid but my account is still showing pending",
        "a": "افتح أي مسار وهتلاقي مكتوب \"طلبك تحت المراجعة\" — يعني وصلنا الطلب وبنراجعه. لو عدّت 24 ساعة كلّمنا على واتساب فورًا.",
        "aEn": "Your order is in review. We typically approve within a few hours. If 24 hours pass, contact WhatsApp support."
      },
      {
        "q": "فيه فواتير؟",
        "qEn": "Can I get an official invoice?",
        "a": "لو محتاج فاتورة أو إيصال، اطلبه منّا على الإيميل وهنبعتهولك.",
        "aEn": "Yes, request an invoice or receipt via email at Tawwerni@gmail.com and we will issue one for your records."
      },
      {
        "q": "أقدر أشترك لفريق أو شركة؟",
        "qEn": "Can I purchase team or corporate licenses?",
        "a": "أيوة، عندنا أسعار خاصة للفرق من 5 أشخاص فأكتر. كلّمنا على Tawwerni@gmail.com.",
        "aEn": "Yes, we offer special team volume discounts for organizations of 5+ members. Reach out at Tawwerni@gmail.com."
      }
    ]
  },
  {
    "key": "learning",
    "title": "التعلّم والدروس",
    "titleEn": "Learning Mechanics & Quizzes",
    "icon": "📚",
    "items": [
      {
        "q": "الدرس شكله إزاي؟",
        "qEn": "How is each daily lesson structured?",
        "a": "كل درس عبارة عن بطاقات قصيرة تقراها واحدة ورا التانية، ثم مهمة عملية تنفذها، ثم كويز من 4 أسئلة يثبّت المعلومة.",
        "aEn": "Each lesson consists of structured reading cards, followed by a concrete hands-on task, and concluded with a 4-question active-recall quiz."
      },
      {
        "q": "ليه فيه كويز بعد كل درس؟",
        "qEn": "Why is there a quiz after every lesson?",
        "a": "لأن الاسترجاع من الذاكرة بيثبّت المعلومة أضعاف القراءة السلبية. الكويز مش امتحان، ده جزء من التعلّم نفسه.",
        "aEn": "Active retrieval practice dramatically outperforms passive reading. Quizzes cement understanding into long-term memory."
      },
      {
        "q": "لو جاوبت غلط في الكويز؟",
        "qEn": "What happens if I answer a quiz question incorrectly?",
        "a": "مفيش مشكلة. هيظهرلك شرح كامل لإجابة كل سؤال، وهتاخد نقاط الخبرة على أي حال. الهدف تفهم مش تتعاقب.",
        "aEn": "No penalty. A comprehensive explanation displays immediately to help you master the concept, and you still earn your XP."
      },
      {
        "q": "أقدر أعيد الكويز؟",
        "qEn": "Can I retake a quiz?",
        "a": "أيوة، تقدر ترجع للدرس وتعيد الكويز في أي وقت.",
        "aEn": "Yes, you can revisit any unlocked lesson and retake the quiz anytime."
      },
      {
        "q": "أقدر أرجع لدرس قديم؟",
        "qEn": "Can I go back to review completed lessons?",
        "a": "أيوة. كل الدروس اللي فتحتها بتفضل متاحة ليك للأبد.",
        "aEn": "Yes! All completed lessons remain permanently available in your library for reference."
      },
      {
        "q": "أقدر أقفز لدرس متقدّم؟",
        "qEn": "Can I jump ahead to advanced lessons?",
        "a": "أيوة تقدر، بس ما ننصحش. الدروس مبنية فوق بعضها والترتيب مقصود.",
        "aEn": "While unlocked, we strongly recommend progressing in order because daily concepts compound systematically."
      },
      {
        "q": "المهمة العملية إجبارية؟",
        "qEn": "Is the daily practical task mandatory?",
        "a": "مش إجبارية تقنيًا، بس هي أهم جزء. المعرفة من غير تطبيق بتتنسى خلال أيام.",
        "aEn": "Technically optional, but practically essential. Knowledge without immediate execution evaporates within days."
      },
      {
        "q": "مش لاقي وقت أعمل المهمة العملية؟",
        "qEn": "What if I don't have time for the hands-on task?",
        "a": "أغلب المهام بتاخد من 5 لـ10 دقايق. لو مش لاقي وقت خالص، اعملها في اليوم اللي بعده — الأهم إنك تعملها.",
        "aEn": "Most tasks take 5-10 minutes. If short on time, execute it the next day — execution is the true secret to progress."
      },
      {
        "q": "إيه هي نقاط الخبرة (XP)؟",
        "qEn": "What are Experience Points (XP)?",
        "a": "نقاط بتكسبها مع كل درس تخلّصه. بتحدد مستواك في المنصة وبتخليك تشوف تقدمك بشكل ملموس.",
        "aEn": "XP reflects your compounding effort. Completing lessons and quizzes awards XP, leveling up your profile status."
      },
      {
        "q": "إيه هي السلسلة (Streak)؟",
        "qEn": "What is the Day Streak?",
        "a": "عدد الأيام المتتالية اللي دخلت فيها وخلّصت درس. الاستمرارية أهم من الكثافة، والسلسلة بتساعدك تحافظ عليها.",
        "aEn": "Your streak tracks consecutive days of completed learning. Consistency compounds exponentially."
      },
      {
        "q": "إيه هي الشارات؟",
        "qEn": "What are achievement badges?",
        "a": "إنجازات بتفتحها لما توصل لمحطات معينة — أول درس، نتيجة مثالية، 7 أيام متتالية، إنهاء وحدة، وهكذا.",
        "aEn": "Badges celebrate major milestones: first completed lesson, 100% quiz scores, 7-day streaks, and course graduation."
      },
      {
        "q": "إيه هي المستويات؟",
        "qEn": "What are learner levels?",
        "a": "كل ما تجمع XP بتترقّى: مبتدئ ← مستكشف ← ممارس ← خبير ← محترف.",
        "aEn": "As you accumulate XP, you advance: Beginner → Explorer → Practitioner → Expert → Master."
      },
      {
        "q": "المحتوى مبني على إيه؟",
        "qEn": "What sources is the curriculum based on?",
        "a": "كل مسار مبني على مصادر موثوقة في مجاله — منظمة الصحة العالمية للصحة، وأبحاث علم النفس السلوكي للعادات، ومراجع الأعمال المعتمدة للبيزنس.",
        "aEn": "All content is synthesized from peer-reviewed behavioral research, industry documentation, and real-world practitioner playbooks."
      },
      {
        "q": "أقدر أسأل سؤال عن درس معيّن؟",
        "qEn": "Can I ask questions about a specific lesson?",
        "a": "أيوة. ابعتلنا سؤالك على واتساب 01069999557 وهنجاوبك.",
        "aEn": "Yes! Chat with our AI Coach Faheem inside the lesson or reach out directly via WhatsApp support."
      },
      {
        "q": "ليه الدروس قصيرة كده؟",
        "qEn": "Why are daily lessons designed to be so short?",
        "a": "لأن التعلّم اليومي القصير المستمر بيتفوّق على الجلسات الطويلة المتقطعة. 10 دقايق يوميًا لـ28 يوم أقوى من 5 ساعات مرة واحدة.",
        "aEn": "Because 10 focused daily minutes consistently beats a sporadic 5-hour marathon. Daily micro-habits guarantee completion."
      },
      {
        "q": "أقدر أستخدم أكتر من جهاز؟",
        "qEn": "Can I learn across multiple devices?",
        "a": "أيوة. سجّل دخول بنفس الإيميل من أي جهاز وتقدّمك هيكون متزامن على طول.",
        "aEn": "Yes! Log in with the same email on phone, tablet, or desktop and your progress syncs in real time."
      },
      {
        "q": "أقدر أشارك تقدّمي مع حد؟",
        "qEn": "Can I share my progress with friends?",
        "a": "أيوة، تقدر تاخد سكرين شوت من صفحة تقدّمك وتشاركها. وبنشتغل على ميزة مشاركة مباشرة.",
        "aEn": "Yes, take a screenshot of your progress dashboard or share your verified certificate directly to LinkedIn."
      },
      {
        "q": "إزاي أعرف أنا واقف فين في كل مسار؟",
        "qEn": "How do I check my progress across all courses?",
        "a": "من صفحة تقدّمك هتلاقي كل المسارات قدامك وتحت كل واحد شريط تقدّم وعدد الأيام اللي خلّصتها.",
        "aEn": "From the Progress tab (/app/progress), you can monitor your streaks, XP, level badges, and course completion percentages."
      },
      {
        "q": "\"مهمة اليوم\" بتختار المسار إزاي؟",
        "qEn": "How does 'Today's Mission' pick which course to show?",
        "a": "بتكمّل من آخر مسار اشتغلت عليه. يعني لو آخر درس عملته كان في مسار الأعمال، مهمة اليوم هتكون الدرس اللي بعده فيه.",
        "aEn": "It automatically continues from your most recently active course so you never lose momentum."
      },
      {
        "q": "لو خلّصت المسار، أعمل إيه بعده؟",
        "qEn": "What should I do after completing a full track?",
        "a": "هتاخد شهادتك، وهنقترح عليك المسار التالي المناسب لأهدافك. الأهم إنك تحافظ على العادة اللي بنيتها.",
        "aEn": "Claim your verified certificate, celebrate your win, and start the next recommended course in your learning roadmap."
      }
    ]
  },
  {
    "key": "account-security",
    "title": "الحساب وكلمة السر",
    "titleEn": "Account & Password Security",
    "icon": "🔐",
    "items": [
      {
        "q": "نسيت كلمة السر، أعمل إيه؟",
        "qEn": "I forgot my password, what should I do?",
        "a": "من صفحة تسجيل الدخول دوس \"نسيت كلمة السر؟\"، اكتب إيميلك، وهيوصلك لينك تحط منه كلمة سر جديدة. اللينك صالح ساعة واحدة وبيشتغل مرة واحدة بس.",
        "aEn": "From the login screen, click 'Forgot Password?', enter your email, and a secure password reset link will be emailed to you."
      },
      {
        "q": "لينك تغيير كلمة السر ما وصلش",
        "qEn": "The password reset link didn't arrive",
        "a": "بصّ في مجلد الـSpam الأول. لو عدّت دقايق ومفيش حاجة، كلّمنا على واتساب 01069999557 وهنظبطهالك يدويًا.",
        "aEn": "Check your spam/junk folder. If not received after a few minutes, message WhatsApp support and we will verify you manually."
      },
      {
        "q": "اللينك بيقول إنه منتهي",
        "qEn": "The reset link says it has expired",
        "a": "اللينك بيعيش ساعة واحدة وبيتحرق أول ما تستخدمه. اطلب واحد جديد من صفحة \"نسيت كلمة السر\" وهيشتغل.",
        "aEn": "Reset links are valid for one hour for security. Request a new link from the forgot password page to proceed."
      },
      {
        "q": "إزاي أغيّر كلمة السر وأنا داخل؟",
        "qEn": "How do I change my password while logged in?",
        "a": "من صفحة \"حسابي\" → قسم الأمان → \"غيّر كلمة السر\". هيطلب منك كلمة السر الحالية الأول، وده مقصود عشان محدش يغيّرها من جهازك لو سبته مفتوح.",
        "aEn": "Go to Profile (/app/profile) → Security → Change Password. Enter your current password and your new password."
      },
      {
        "q": "ليه بيطلب كلمة السر القديمة وأنا مسجّل دخول أصلًا؟",
        "qEn": "Why does it require my old password to change it?",
        "a": "لأن الجلسة المفتوحة مش إثبات كافي إنك إنت. لو حد لقى لابتوبك مفتوح، الخطوة دي بتمنعه إنه يستولي على حسابك نهائيًا.",
        "aEn": "To prevent someone from taking over your account if your device was temporarily left unattended."
      },
      {
        "q": "هل حد عندكم يقدر يشوف كلمة السر بتاعتي؟",
        "qEn": "Can your team see my password?",
        "a": "لأ، ومستحيل تقنيًا. كلمات السر مخزّنة مشفّرة في اتجاه واحد (scrypt) — يعني حتى إحنا مش شايفينها، ولو حد سرق قاعدة البيانات مش هيقدر يطلّعها منها.",
        "aEn": "No, passwords are cryptographically hashed using one-way scrypt encryption. Nobody can read or recover them."
      },
      {
        "q": "حسابي اتقفل وبيقول استنى 15 دقيقة",
        "qEn": "My account says 'Locked, wait 15 minutes'",
        "a": "ده بيحصل بعد 8 محاولات دخول غلط ورا بعض، وهو حماية ضد اللي بيحاول يخمّن كلمة سرك. استنى 15 دقيقة، أو استخدم \"نسيت كلمة السر\" وهتدخل على طول.",
        "aEn": "This triggers after 8 consecutive failed attempts to protect your account against brute-force attacks. Wait 15 minutes or reset your password."
      },
      {
        "q": "إيه شروط كلمة السر؟",
        "qEn": "What are the password requirements?",
        "a": "8 حروف على الأقل. مفيش شروط معقّدة عن حروف كبيرة ورموز — الطول هو اللي بيفرق فعلًا. جملة قصيرة تفتكرها أقوى من كلمة قصيرة معقّدة.",
        "aEn": "At least 8 characters. Length matters more than complex symbols — a memorable passphrase is ideal."
      },
      {
        "q": "إزاي أضيف صورة شخصية؟",
        "qEn": "How do I upload a profile photo?",
        "a": "من \"حسابي\" دوس على الصورة الدايرية وهيفتحلك تختار صورة من جهازك. الصورة بتتصغّر تلقائيًا قبل ما تترفع.",
        "aEn": "Go to Profile and tap your avatar circle. Select an image from your device and it will resize automatically without cropping."
      },
      {
        "q": "أقدر أشيل الصورة؟",
        "qEn": "Can I remove my profile photo?",
        "a": "أيوة، من نفس المكان هتلاقي زرار \"شيلها\" — وهترجع لأول حرف من اسمك زي الأول.",
        "aEn": "Yes, tap 'Remove' in the profile picture section to revert to your default initials tile."
      },
      {
        "q": "أقدر أغيّر الإيميل بتاعي؟",
        "qEn": "Can I change my registered email address?",
        "a": "كلّمنا على واتساب 01069999557 أو Tawwerni@gmail.com ومعاك إيميلك القديم والجديد وهنغيّره لك.",
        "aEn": "Contact us via WhatsApp or email with your old and new email addresses and we will update it safely."
      },
      {
        "q": "أقدر أمسح حسابي؟",
        "qEn": "Can I permanently delete my account?",
        "a": "أيوة. ابعتلنا طلب على Tawwerni@gmail.com وهنمسح حسابك وكل بياناتك خلال 48 ساعة.",
        "aEn": "Yes. Send an account deletion request to Tawwerni@gmail.com and we will delete your data within 48 hours."
      }
    ]
  },
  {
    "key": "certificates",
    "title": "الشهادات",
    "titleEn": "Certificates & Public Verification",
    "icon": "🎓",
    "items": [
      {
        "q": "فين الشهادة بتاعتي؟",
        "qEn": "Where is my certificate located?",
        "a": "من صفحة المسار، لما تخلّص كل أيامه، الزرار اللي فوق بيتحوّل لـ\"شوف شهادتك 🎓\". أو ادخل مباشرة على صفحة المسار وهتلاقي لينك الشهادة في قايمة \"الكورس يشمل\".",
        "aEn": "Once all days in a track are complete, tap 'View Certificate' at the top of the track page or visit the certificate link in the menu."
      },
      {
        "q": "إمتى بتتفتح الشهادة؟",
        "qEn": "When does the certificate unlock?",
        "a": "لما تخلّص كل دروس المسار — مش بمجرد الدفع. الشهادة اللي بتاخدها من غير ما تعمل الشغل مالهاش أي قيمة، وعشان كده مربوطة بالإنجاز الحقيقي.",
        "aEn": "Only when 100% of lessons in that course are finished. Meaningful credentials are tied to real execution, not passive browsing."
      },
      {
        "q": "خلّصت المسار بس الشهادة لسه مقفولة",
        "qEn": "I finished the track but the certificate is locked",
        "a": "افتح صفحة الشهادة وهتلاقي مكتوب خلّصت كام درس من كام. غالبًا فيه يوم أو اتنين ناقصين — كمّلهم وهتتفتح فورًا.",
        "aEn": "Open the certificate page to see missing days. Complete the remaining 1 or 2 lessons and it unlocks instantly."
      },
      {
        "q": "الشهادة معتمدة؟",
        "qEn": "Is the certificate verified?",
        "a": "الشهادة صادرة من طوّرني وبتثبت إنك أنهيت البرنامج فعليًا (مش مجرد مشاهدة). مش شهادة أكاديمية معتمدة من جهة حكومية.",
        "aEn": "Yes, every certificate carries a unique serial code and public verification link (/verify/[code]) accessible worldwide."
      },
      {
        "q": "إزاي أحفظ الشهادة PDF؟",
        "qEn": "How can I export or save my certificate as PDF?",
        "a": "من صفحة الشهادة دوس \"اطبع / احفظ PDF\"، وفي شاشة الطباعة اختار \"Save as PDF\". الصفحة معمولة مخصوص تطلع نضيفة على الورق.",
        "aEn": "Tap 'Print / Save as PDF' on the certificate screen and select 'Save as PDF' in the print dialog for a crisp vector document."
      },
      {
        "q": "أقدر أحطها في LinkedIn؟",
        "qEn": "Can I add the certificate to LinkedIn?",
        "a": "أيوة. احفظها PDF أو خد سكرين شوت وضيفها في قسم الشهادات — واذكر عدد الأيام والمهام العملية اللي نفّذتها، ده اللي بيفرق.",
        "aEn": "Yes! Save it or copy the public verification URL and add it under LinkedIn's Licenses & Certifications section."
      },
      {
        "q": "إيه اللي مكتوب في الشهادة؟",
        "qEn": "What information is printed on the certificate?",
        "a": "اسمك، اسم المسار، عدد الدروس، نقاط الخبرة، متوسط نتايجك في الكويزات، تاريخ الإتمام، ورقم شهادة مميز.",
        "aEn": "Your name, course title, total completed lessons, earned XP, average quiz score, issue date, and unique verification code."
      },
      {
        "q": "الاسم في الشهادة غلط",
        "qEn": "My name is misspelled on the certificate",
        "a": "غيّر اسمك من صفحة \"حسابي\" والشهادة هتتحدّث فورًا — مش محتاج تطلب حاجة منّا.",
        "aEn": "Update your name on your Profile page (/app/profile) and your certificate updates instantly in real time."
      },
      {
        "q": "بياخد شهادة لكل مسار؟",
        "qEn": "Do I get a certificate for every course I complete?",
        "a": "أيوة. كل مسار ليه شهادة مستقلة برقمها الخاص، بتتفتح لما تخلّصه.",
        "aEn": "Yes! Every single one of the 100 courses has its own dedicated certificate upon completion."
      }
    ]
  },
  {
    "key": "referrals",
    "title": "برنامج الإحالة",
    "titleEn": "Referral & Affiliate Program",
    "icon": "💰",
    "items": [
      {
        "q": "إيه هو برنامج الإحالة؟",
        "qEn": "What is the referral program?",
        "a": "بتاخد 50 جنيه عن كل شخص يشترك من اللينك بتاعك. مفيش حد أقصى لعدد الناس.",
        "aEn": "You earn 50 EGP for every person who subscribes through your personal referral link, with unlimited earning potential."
      },
      {
        "q": "فين اللينك بتاعي؟",
        "qEn": "Where do I find my referral link?",
        "a": "من صفحة \"اكسب\" في القايمة تحت. هتلاقي اللينك جاهز وزرار نسخ.",
        "aEn": "Go to the Earn tab (/app/referrals) in the navigation bar to find your unique link and one-tap copy button."
      },
      {
        "q": "إمتى بتتحسب العمولة؟",
        "qEn": "When is commission credited?",
        "a": "لما الشخص يدفع فعلًا ويتفعّل حسابه — مش لما يعمل حساب بس. ده بيخلي الرصيد اللي شايفه فلوس حقيقية وصلتنا.",
        "aEn": "Commission credits as soon as the referred user's payment is approved and activated on the platform."
      },
      {
        "q": "أقل مبلغ أقدر أسحبه كام؟",
        "qEn": "What is the minimum withdrawal amount?",
        "a": "500 جنيه. لما رصيدك يوصلها، زرار السحب بيتفعّل في صفحة \"اكسب\".",
        "aEn": "500 EGP. As soon as your withdrawable balance reaches 500 EGP, the payout request button activates."
      },
      {
        "q": "بستلم الفلوس إزاي؟",
        "qEn": "How do I receive my earnings?",
        "a": "فودافون كاش أو إنستاباي، على الرقم اللي بتكتبه وقت طلب السحب.",
        "aEn": "Via Vodafone Cash or InstaPay directly to the phone number or username you enter during withdrawal."
      },
      {
        "q": "السحب بياخد قد إيه؟",
        "qEn": "How long do payouts take?",
        "a": "بنحوّل خلال أيام عمل قليلة من طلب السحب. هيوصلك تأكيد أول ما نحوّل.",
        "aEn": "Payouts are transferred within a few business days. You receive confirmation as soon as funds are dispatched."
      },
      {
        "q": "لو حد فتح لينكي وسجّل بعدين بأيام؟",
        "qEn": "What if someone clicks my link and subscribes days later?",
        "a": "بتتحسبلك عادي. اللينك بيفضل متسجّل في متصفحه لفترة، والعمولة بتترتبط بحسابه أول ما يعمله.",
        "aEn": "Your referral cookie remains active in their browser, so the commission is automatically attributed to your account."
      },
      {
        "q": "أقدر أستخدم لينكي على نفسي؟",
        "qEn": "Can I refer myself?",
        "a": "لأ، النظام بيرفض ده تلقائيًا. الإحالة بتشتغل بس مع حسابات تانية.",
        "aEn": "No, self-referrals are automatically rejected by our audit system. Referrals only apply to genuine third-party users."
      }
    ]
  },
  {
    "key": "technical",
    "title": "مشاكل تقنية",
    "titleEn": "Technical Support & Troubleshooting",
    "icon": "🛠️",
    "items": [
      {
        "q": "الموقع مش بيفتح عندي",
        "qEn": "The website won't load on my browser",
        "a": "جرّب تعمل تحديث للصفحة، أو امسح الكاش، أو جرّب متصفح تاني. لو المشكلة مستمرة كلّمنا على واتساب.",
        "aEn": "Refresh the page, clear your browser cache, or try another browser. If it persists, reach out via WhatsApp."
      },
      {
        "q": "مش عارف أسجّل دخول",
        "qEn": "I can't sign in to my account",
        "a": "اتأكد إنك بتستخدم نفس الإيميل اللي عملت بيه الحساب. لو نسيت كلمة السر، استخدم \"نسيت كلمة السر؟\" وهيوصلك لينك تغيّرها منه.",
        "aEn": "Ensure you are using the exact email you registered with. Use 'Forgot Password' if you need to reset your password."
      },
      {
        "q": "الصفحة طالعة بيضا من غير تصميم",
        "qEn": "The page appears blank without styles",
        "a": "ده بيحصل لو الاتصال قطع وسط تحميل الصفحة. اعمل Refresh قوي (Ctrl+Shift+R). لو استمر، كلّمنا.",
        "aEn": "This happens during interrupted internet connections. Perform a hard refresh (Ctrl+Shift+R or pull down on mobile)."
      },
      {
        "q": "تقدّمي اختفى!",
        "qEn": "My course progress disappeared!",
        "a": "غالبًا انت داخل بإيميل مختلف. اتأكد من الإيميل، ولو المشكلة موجودة كلّمنا فورًا وهنسترجع بياناتك.",
        "aEn": "Double check that you logged in with your original email address. If needed, message support and we will recover your data."
      },
      {
        "q": "الصفحة بطيئة",
        "qEn": "The site feels slow on my connection",
        "a": "جرّب إنترنت أسرع أو اقفل التابات الزيادة. الموقع خفيف ومفروض يفتح بسرعة حتى على نت ضعيف.",
        "aEn": "Tawwerni is lightweight and optimized for mobile 3G/4G connections. Close unused background browser tabs."
      },
      {
        "q": "الكويز مش بيسجّل إجابتي",
        "qEn": "The quiz isn't registering my answer",
        "a": "اعمل تحديث للصفحة وجرّب تاني. لو المشكلة استمرت، ابعتلنا سكرين شوت.",
        "aEn": "Refresh the page and re-select your answer. If issues continue, send a screenshot to our support line."
      },
      {
        "q": "الموقع شكله متكسّر على الموبايل",
        "qEn": "The layout looks broken on my device",
        "a": "جرّب تحدّث المتصفح لأحدث نسخة. لو المشكلة موجودة، ابعتلنا سكرين شوت ونوع الموبايل.",
        "aEn": "Update your mobile browser to the latest version. If persistent, share your phone model with us for optimization."
      },
      {
        "q": "الألوان مرهقة لعيني",
        "qEn": "The colors are too bright for my eyes",
        "a": "دوس على أيقونة القمر/الشمس فوق في الهيدر وهتقلب بين الوضع النهاري والليلي. الاختيار بيتحفظ لمرات الدخول الجاية.",
        "aEn": "Tap the Sun/Moon toggle in the top header to switch between Light Mode and Dark Mode. Your choice is saved."
      },
      {
        "q": "مش عايز الأنيميشنز دي",
        "qEn": "How do I disable animations?",
        "a": "لو مفعّل \"تقليل الحركة\" في إعدادات جهازك، الموقع بيحترم ده ويوقف كل الحركة تلقائيًا.",
        "aEn": "Enable 'Reduce Motion' in your operating system settings; Tawwerni automatically respects your accessibility preferences."
      },
      {
        "q": "الصورة اللي رفعتها مش بتتحفظ",
        "qEn": "My uploaded avatar photo isn't saving",
        "a": "اتأكد إنها JPG أو PNG أو WebP. الصور الكبيرة جدًا بتتصغّر تلقائيًا، بس لو الملف مش صورة أصلًا هيترفض.",
        "aEn": "Ensure the file is a JPG, PNG, or WebP image under 8MB. Our picker automatically optimizes and resizes it."
      },
      {
        "q": "نسيت الإيميل اللي سجّلت بيه",
        "qEn": "I forgot which email address I registered with",
        "a": "كلّمنا على واتساب برقم التحويل اللي دفعت منه وهنلاقيلك حسابك.",
        "aEn": "Message us on WhatsApp with the phone number or transaction receipt you used for payment, and we will locate your account."
      },
      {
        "q": "أقدر أضيف الموقع لشاشة الموبايل؟",
        "qEn": "Can I add Tawwerni to my phone home screen?",
        "a": "أيوة. من قايمة المتصفح اختار \"إضافة إلى الشاشة الرئيسية\" وهيبقى زي أي تطبيق.",
        "aEn": "Yes! Open your browser menu and tap 'Add to Home screen' or 'Install App' to access Tawwerni like a native app."
      }
    ]
  },
  {
    "key": "motivation",
    "title": "التحفيز والاستمرار",
    "titleEn": "Habits, Mindset & Consistency",
    "icon": "🔥",
    "items": [
      {
        "q": "مش لاقي حافز أكمّل",
        "qEn": "I'm struggling with motivation to continue",
        "a": "الحافز متقلّب بطبيعته. اللي بيشتغل فعلًا هو النظام: وقت ثابت كل يوم + خطوة صغيرة جدًا. ابدأ بـ5 دقايق بس النهاردة.",
        "aEn": "Motivation fluctuates naturally. Rely on systems instead: anchor a fixed 5-minute block every day to build a habit."
      },
      {
        "q": "قطعت السلسلة وحاسس إني فشلت",
        "qEn": "I broke my streak and feel discouraged",
        "a": "قاعدة بسيطة: متفوّتش مرتين. يوم واحد مش مشكلة، لكن متخليش اليوم التاني يبقى أسبوع. ارجع النهاردة.",
        "aEn": "Follow the golden rule: never miss twice. Missing one day is normal life; don't let it turn into a week. Rebound today."
      },
      {
        "q": "حاسس إن التقدّم بطيء",
        "qEn": "Progress feels slow and incremental",
        "a": "ده طبيعي. أغلب النتائج المهمة بتتحرك ببطء ثم تظهر فجأة. قِس التزامك (كام يوم عملت)، مش النتيجة بس.",
        "aEn": "All meaningful compounding starts invisible before becoming dramatic. Measure your consistency rather than instant perfection."
      },
      {
        "q": "بدأت مسارات قبل كده وما كمّلتش",
        "qEn": "I've started courses before and never finished",
        "a": "غالبًا لأن الخطوة كانت كبيرة أوي. هنا الخطوة اليومية 5-15 دقيقة بس، ومصممة عشان تكمّل مش عشان تبهرك في اليوم الأول.",
        "aEn": "Because past courses demanded overwhelming hours. Tawwerni's daily 5-15 minute design is engineered specifically for completion."
      },
      {
        "q": "مش فاضي خالص",
        "qEn": "I genuinely don't have enough free time",
        "a": "لو مش لاقي 10 دقايق في يومك، دي في حد ذاتها معلومة مهمة عن إدارة وقتك — وده بالظبط اللي مسار \"نمط النجاح\" بيشتغل عليه.",
        "aEn": "If 10 minutes feels impossible, that itself is critical data about time allocation. Our Productivity tracks solve this directly."
      },
      {
        "q": "بقارن نفسي بحد أسرع مني",
        "qEn": "I keep comparing my pace to others",
        "a": "المقارنة الوحيدة المفيدة هي مع نفسك من 28 يوم فاتوا. كل واحد وظروفه ونقطة بدايته.",
        "aEn": "The only meaningful benchmark is comparing yourself to 28 days ago. Everyone starts from a different baseline."
      },
      {
        "q": "خايف أدفع وما كمّلش",
        "qEn": "I'm worried about paying and then stopping",
        "a": "ده قلق منطقي. عشان كده اليوم الأول من كل مسار مجاني — تقدر تجرّب أي درس من الـ 100 مسار الأول. ولإنه وصول لمدة سنة مفيش عداد بيجري عليك: تقدر تاخد وقتك وترجع تكمّل براحتك.",
        "aEn": "Try Day 1 of any course for free first. With 1-year access, there is no ticking clock — you learn at your own pace."
      },
      {
        "q": "إزاي أحافظ على العادة بعد الـ28 يوم؟",
        "qEn": "How do I sustain this habit after 28 days?",
        "a": "كل مسار بينتهي بـ\"نظام صيانة\" — قواعد بسيطة تكمّل عليها. الهدف مش تخلّص، الهدف تبني نظام تعيش بيه.",
        "aEn": "Every track concludes with a Maintenance System — simple rules to sustain your capability for life."
      },
      {
        "q": "أنا مش شخص منضبط بطبيعتي",
        "qEn": "I am not naturally disciplined",
        "a": "الانضباط مش صفة ولادية، هو نتيجة بيئة وأنظمة. غيّر البيئة قبل ما تختبر إرادتك — ودي فكرة أساسية في مسار نمط النجاح.",
        "aEn": "Discipline is not an inborn gene; it is a byproduct of environment and frictionless systems. Change the system first."
      },
      {
        "q": "بحس إني كبير على التعلّم",
        "qEn": "I feel too old to learn new tech skills",
        "a": "التعلّم مالوش سن. اللي بيفرق هو الوضوح في الهدف والاستمرارية، مش العمر.",
        "aEn": "Learning has no expiration date. What matters is clear direction and small daily steps, not your age."
      }
    ]
  },
  {
    "key": "about",
    "title": "عن المنصة",
    "titleEn": "About Tawwerni",
    "icon": "🏢",
    "items": [
      {
        "q": "مين وراء طوّرني؟",
        "qEn": "Who is behind Tawwerni?",
        "a": "طوّرني منصة عربية مستقلة هدفها إن التعلّم اليومي القصير يتحوّل لتقدّم حقيقي في حياة الناس.",
        "aEn": "Tawwerni is an independent learning platform dedicated to transforming short daily learning into real career and income progress."
      },
      {
        "q": "ليه اسمها طوّرني؟",
        "qEn": "What does the name Tawwerni mean?",
        "a": "لأن الاسم فعل أمر — طلب موجّه لنفسك، مش وعد من حد تاني. أنت اللي بتطوّر نفسك، وإحنا بنوفّر النظام.",
        "aEn": "Tawwerni is an active Arabic imperative ('Develop me!') — a personal commitment to self-mastery, enabled by our structured system."
      },
      {
        "q": "إزاي أتواصل معاكم؟",
        "qEn": "How do I reach the team?",
        "a": "واتساب 01069999557 أو إيميل Tawwerni@gmail.com. بنرد عادة خلال ساعات قليلة.",
        "aEn": "WhatsApp at 01069999557 or email at Tawwerni@gmail.com. We usually respond within a few hours."
      },
      {
        "q": "فيه مجتمع أو جروب؟",
        "qEn": "Is there a community for learners?",
        "a": "بنشتغل على مجتمع للمتعلمين. اشترك في أي مسار وهيوصلك دعوة أول ما يفتح.",
        "aEn": "Yes! Visit our Community Wall (/community) to read verified learner success stories and connect with peers."
      },
      {
        "q": "أقدر أقترح مسار جديد؟",
        "qEn": "Can I suggest a new course topic?",
        "a": "أكيد! ابعتلنا اقتراحك على Tawwerni@gmail.com. أغلب المسارات الجديدة بتيجي من اقتراحات المتعلمين.",
        "aEn": "Absolutely! Email your suggestion to Tawwerni@gmail.com. Many new tracks originate directly from learner requests."
      },
      {
        "q": "بتستخدموا بياناتي في إيه؟",
        "qEn": "How is my personal data used?",
        "a": "بياناتك (الإيميل والتقدّم) بتُستخدم بس لتشغيل حسابك. مش بنبيعها ولا بنشاركها مع أي طرف تالت.",
        "aEn": "Your data (email and progress) is strictly used to run your account. We never sell or share data with third parties."
      },
      {
        "q": "هتضيفوا مسارات جديدة؟",
        "qEn": "Will you add more courses in the future?",
        "a": "أيوة، بنشتغل على مسارات جديدة باستمرار. الأولوية للمسارات اللي المتعلمين بيطلبوها أكتر.",
        "aEn": "Yes, we expand our catalog continuously with high-demand skills requested by our community."
      },
      {
        "q": "ليه عندكم 100 مسار في 10 مجالات؟",
        "qEn": "Why did you build 100 tracks across 10 disciplines?",
        "a": "لأننا صممنا المنصة لتغطي خريطة متكاملة للمهارات الأكثر طلبًا في سوق العمل اليوم ومستقبلًا (من الذكاء الاصطناعي والبرمجة حتى البيزنس وإدارة الذات). كل مسار مكتوب بعناية خطوة بخطوة باللغتين مع تطبيق عملي مباشر وبطاقات معرفية مكثفة بدون حشو.",
        "aEn": "To provide a complete career roadmap for the future economy. From AI and coding to sales, freelancing, and mindset."
      },
      {
        "q": "فيه تطبيق موبايل؟",
        "qEn": "Is there a mobile app?",
        "a": "الموقع نفسه مصمم للموبايل وبيشتغل زي التطبيق. تقدر تضيفه لشاشتك الرئيسية من المتصفح.",
        "aEn": "Tawwerni is built as a Progressive Web App (PWA) that functions seamlessly on your smartphone like a native app."
      },
      {
        "q": "إزاي أدعم المنصة؟",
        "qEn": "How can I support Tawwerni?",
        "a": "أفضل دعم إنك تكمّل مسارك وتحكي لحد تعرفه عن تجربتك. الكلام الحقيقي من متعلم حقيقي أقوى من أي إعلان.",
        "aEn": "The greatest support is finishing your tracks and recommending Tawwerni to colleagues who want to level up."
      }
    ]
  },
  {
    "key": "track-ai",
    "title": "مسار الذكاء الاصطناعي",
    "titleEn": "ChatGPT & AI Prompting Track",
    "icon": "🤖",
    "items": [
      {
        "q": "المسار ده بيعلّمني إيه بالظبط؟",
        "qEn": "What exactly does the AI track teach?",
        "a": "28 يوم من الصفر: تفهم الذكاء الاصطناعي بيشتغل إزاي، تتقن كتابة الأوامر (Prompting)، تستخدمه في شغلك اليومي، وتبني بيه مصدر دخل إضافي.",
        "aEn": "28 days from zero: understand how modern AI works, master prompt engineering, deploy AI in daily workflows, and build monetization avenues."
      },
      {
        "q": "محتاج خلفية تقنية أو برمجة؟",
        "qEn": "Do I need coding or technical skills?",
        "a": "لأ خالص. مفيش سطر كود واحد في المسار. لو بتعرف تكتب رسالة واتساب، تقدر تستخدم الأدوات دي.",
        "aEn": "Zero coding required. If you know how to send a chat message, you can master these practical AI frameworks."
      },
      {
        "q": "هستخدم أنهي أدوات؟",
        "qEn": "Which AI tools will I use?",
        "a": "أدوات مجانية في الأساس — ChatGPT وClaude وأدوات الصور والصوت. المسار بيركّز على المهارة مش على أداة معينة، عشان تفضل شغالة مع أي أداة جديدة.",
        "aEn": "Primary free tools: ChatGPT, Claude, visual generation tools, and automation scripts. The core focus is timeless prompting skills."
      },
      {
        "q": "لازم أدفع اشتراكات للأدوات؟",
        "qEn": "Do I need paid AI tool subscriptions?",
        "a": "لأ. كل المهام في المسار ممكن تتنفّذ بالنسخ المجانية. النسخ المدفوعة بتسرّع بس مش شرط.",
        "aEn": "No. All daily tasks can be executed on free tiers of ChatGPT and Claude."
      },
      {
        "q": "هقدر أكسب فلوس فعلًا من ده؟",
        "qEn": "Can I realistically earn money with these skills?",
        "a": "الوحدة الأخيرة بالكامل عن ده: خدمات تقدر تقدّمها، إزاي تسعّرها، وإزاي تلاقي أول عميل. النتيجة بتعتمد على تنفيذك، بس الطريق موضّح خطوة خطوة.",
        "aEn": "The final module is entirely dedicated to monetization: high-demand services, pricing models, and landing your first paying client."
      },
      {
        "q": "الذكاء الاصطناعي هياخد شغلي؟",
        "qEn": "Will AI take my job?",
        "a": "المسار بيجاوب على ده في أول أسبوع. الخلاصة: الأدوات مش هتاخد شغلك، بس اللي بيستخدمها هياخده. عشان كده إنت هنا.",
        "aEn": "AI won't replace humans, but professionals who master AI will replace those who don't. That's why this course exists."
      },
      {
        "q": "إيه الفرق بينه وبين مسار كلود لمديري المشاريع؟",
        "qEn": "How does this differ from the Claude PM track?",
        "a": "ده المسار العام — أساسيات وأدوات وتطبيقات واسعة. مسار كلود متخصص في إدارة المشاريع تحديدًا: تخطيط، مخاطر، ميزانية، تقارير.",
        "aEn": "This is a broad foundational track covering diverse workflows. Claude PM focuses specifically on project leadership, budgets, and reporting."
      },
      {
        "q": "المحتوى هيقدم بسرعة عشان المجال بيتغيّر؟",
        "qEn": "Will this content become obsolete as AI evolves?",
        "a": "المسار مبني على المهارة (إزاي تفكّر وتوجّه الأداة) مش على أزرار أداة معينة، وده اللي بيخليه صامد. وبنحدّث الأمثلة والأدوات باستمرار.",
        "aEn": "The curriculum teaches strategic mental models and structured prompting architectures that work across all present and future models."
      },
      {
        "q": "أنا مجرّب ChatGPT قبل كده، هستفيد؟",
        "qEn": "I already use ChatGPT casually, will I benefit?",
        "a": "أيوة. أغلب الناس بتستخدم الأدوات دي بشكل سطحي جدًا. المسار بيوصلك للفرق بين إجابة عادية وإجابة تنفع تستخدمها في شغل حقيقي.",
        "aEn": "Yes! Casual users only tap 5% of AI capability. This track bridges the gap between basic chat and professional studio-grade outputs."
      }
    ]
  },
  {
    "key": "track-claude-pm",
    "title": "شهادة كلود لمديري المشاريع",
    "titleEn": "Claude for Project Managers Track",
    "icon": "📋",
    "items": [
      {
        "q": "المسار ده لمين؟",
        "qEn": "Who is this track designed for?",
        "a": "لمديري المشاريع، وقادة الفرق، وأي حد مسؤول عن تسليم شغل في وقت محدد بميزانية محددة — حتى لو مش اسمه الوظيفي \"مدير مشروع\".",
        "aEn": "Project managers, team leads, department heads, and anyone responsible for delivering projects on time and within budget."
      },
      {
        "q": "هتعلّم إيه فيه؟",
        "qEn": "What skills will I learn?",
        "a": "17 درس عملي: تخطيط المشاريع، تحليل المخاطر، إدارة الميزانية، كتابة التقارير، والأتمتة — كلها باستخدام كلود بشكل عملي مش نظري.",
        "aEn": "17 practical sessions: project scoping, risk modeling, budget forecasting, executive briefs, and workflow automation with Claude."
      },
      {
        "q": "ليه 17 درس مش 28؟",
        "qEn": "Why 17 lessons instead of 28?",
        "a": "لأن المحتوى ده متخصص ومكثّف. المسار مبني على المهام اللي مدير المشروع بيعملها فعلًا، من غير حشو عشان نوصل لرقم معيّن.",
        "aEn": "Because this track is hyper-focused and dense with zero filler, built strictly around real PM tasks."
      },
      {
        "q": "محتاج أعرف كلود قبل ما أبدأ؟",
        "qEn": "Do I need previous experience with Claude?",
        "a": "لأ. المسار بيبدأ من الصفر ويوصلك لاستخدام متقدّم مخصص لإدارة المشاريع.",
        "aEn": "No. The track starts from basics and guides you to advanced artifact generation and complex document synthesis."
      },
      {
        "q": "الشهادة دي معتمدة من Anthropic؟",
        "qEn": "Is this certificate issued by Anthropic?",
        "a": "لأ. دي شهادة إتمام من طوّرني بتثبت إنك أنهيت البرنامج، مش شهادة رسمية من الشركة صاحبة كلود.",
        "aEn": "No, this is an official completion certificate issued by Tawwerni validating your practical execution of the curriculum."
      },
      {
        "q": "هينفع أستخدمه مع أدوات تانية زي ChatGPT؟",
        "qEn": "Can I apply these techniques in ChatGPT as well?",
        "a": "أغلب الأساليب هتشتغل مع أي أداة قوية. المسار بيستخدم كلود كمثال لأنه ممتاز في الملفات الطويلة والتحليل، بس المبدأ عام.",
        "aEn": "Yes, the analytical frameworks apply to any advanced LLM, though Claude is highlighted for its superior long-context analysis."
      },
      {
        "q": "فيه قوالب جاهزة أقدر أستخدمها؟",
        "qEn": "Are there ready-to-use PM templates included?",
        "a": "أيوة. كل درس بينتهي بمهمة عملية بتطلع منها حاجة تقدر تستخدمها في شغلك على طول — خطة، تقرير، أو تحليل مخاطر.",
        "aEn": "Yes! Every lesson produces a concrete artifact you can deploy at work immediately: charters, risk registers, and status decks."
      },
      {
        "q": "لازم أكون شغال على مشروع دلوقتي؟",
        "qEn": "Do I need to be actively managing a live project?",
        "a": "أحسن كتير لو أيوة، عشان تطبّق على مشروع حقيقي. لو لأ، المسار فيه أمثلة جاهزة تشتغل عليها.",
        "aEn": "Helpful if you are, but the track provides rich realistic case studies if you are not currently managing one."
      },
      {
        "q": "إيه الفرق بينه وبين شهادة PMP؟",
        "qEn": "How does this differ from a traditional PMP certification?",
        "a": "مختلفين تمامًا. PMP شهادة مهنية عالمية في منهجية إدارة المشاريع. ده مسار عملي في استخدام الذكاء الاصطناعي كأداة داخل شغلك اليومي كمدير مشروع.",
        "aEn": "PMP is a theoretical methodology certification. This course is a hands-on tactical playbook for using AI to 10x your daily PM execution."
      }
    ]
  },
  {
    "key": "track-career",
    "title": "مسار النمو المهني",
    "titleEn": "Career Growth & Promotion Track",
    "icon": "💼",
    "items": [
      {
        "q": "المسار ده هيساعدني إزاي؟",
        "qEn": "How will this track help my career?",
        "a": "28 يوم تبني فيهم وضوح مهني حقيقي: تعرف إنت فين، رايح فين، ناقصك إيه، وإزاي توصل — بدل ما تجمع شهادات على أمل إنها تفرق.",
        "aEn": "28 days to gain career clarity: evaluate your market positioning, identify skill gaps, master strategic visibility, and negotiate promotions."
      },
      {
        "q": "أنا لسه بادئ شغل، ينفعلي؟",
        "qEn": "I just started my career, is this relevant?",
        "a": "أيوة، وممكن يبقى أنفع ليك من غيرك. الوضوح في أول 5 سنين بيوفّر عليك سنين من الشغل في الاتجاه الغلط.",
        "aEn": "Extremely. Clarity in your first 5 years saves you years of spinning your wheels in stagnant roles."
      },
      {
        "q": "أنا عايز أغيّر مجالي بالكامل",
        "qEn": "I want to transition into a completely different field",
        "a": "المسار فيه وحدة كاملة عن الانتقال بين المجالات: إزاي تنقل المهارات اللي معاك، وإيه اللي فعلًا محتاج تتعلّمه من الأول.",
        "aEn": "Module 3 focuses specifically on career pivots: mapping transferable skills and positioning yourself credibly for new industries."
      },
      {
        "q": "هيساعدني في الـCV والمقابلات؟",
        "qEn": "Will this improve my resume and interview performance?",
        "a": "أيوة، فيه دروس عملية عن كتابة سيرة ذاتية بتتقري فعلًا، والتحضير للمقابلات، والتفاوض على المرتب.",
        "aEn": "Yes, including high-converting resume frameworks, STAR-method interview mastery, and compensation negotiation scripts."
      },
      {
        "q": "إزاي أطلب زيادة أو ترقية؟",
        "qEn": "How do I ask for a raise or promotion?",
        "a": "فيه دروس مخصصة لده: إزاي توثّق أثرك بالأرقام، وإمتى تطلب، وإزاي تدير المحادثة نفسها.",
        "aEn": "Dedicated lessons teach you how to quantify your business impact, time the conversation, and lead compensation discussions confidently."
      },
      {
        "q": "مش عارف أنا عايز إيه أصلًا",
        "qEn": "What if I don't know what career path I want?",
        "a": "دي نقطة البداية بالظبط. أول أسبوع كامل عن تشخيص وضعك الحالي وتحديد اتجاهك، قبل أي كلام عن خطوات.",
        "aEn": "The entire first week is dedicated to career diagnostic self-assessment to clarify your competitive edge and long-term vision."
      },
      {
        "q": "المحتوى مناسب للسوق العربي؟",
        "qEn": "Is this tailored for regional and remote job markets?",
        "a": "أيوة. الأمثلة والنصايح مكتوبة للسياق العربي — سوق الشغل هنا، والشغل عن بُعد للخارج كمان.",
        "aEn": "Yes, covering both regional market dynamics and strategies for landing remote international roles."
      },
      {
        "q": "فيه فرق بينه وبين مسار نمط النجاح؟",
        "qEn": "How does this differ from the Success Mindset track?",
        "a": "نمط النجاح عن العادات والعقلية بشكل عام. النمو المهني عن مسارك الوظيفي تحديدًا — قرارات، تموضع، وتفاوض.",
        "aEn": "Mindset focuses on personal habits and psychology. Career Growth focuses specifically on professional positioning, politics, and earnings."
      },
      {
        "q": "أنا صاحب مشروع، ينفعلي؟",
        "qEn": "Is this useful for founders or business owners?",
        "a": "ينفع، بس مسار \"بناء الأعمال\" أقرب لوضعك. لو بتشتغل بنفسك وعندك فريق صغير، الاتنين مفيدين.",
        "aEn": "It can be, but our Business & Startups track is tailored more directly for founders building standalone ventures."
      }
    ]
  },
  {
    "key": "track-business",
    "title": "مسار بناء الأعمال",
    "titleEn": "Business & Startups Track",
    "icon": "📈",
    "items": [
      {
        "q": "المسار ده بيعلّمني إيه؟",
        "qEn": "What does this business track teach?",
        "a": "28 يوم من فهم البيزنس لبناء مشروع قابل للنمو: تحديد المشكلة، معرفة العميل، بناء العرض، التسعير، والأرقام اللي لازم تتابعها.",
        "aEn": "28 days to validate and build a scalable venture: problem discovery, ideal customer profiling, offer creation, pricing, and unit economics."
      },
      {
        "q": "لازم يكون عندي مشروع قبل ما أبدأ؟",
        "qEn": "Do I need an existing business to start?",
        "a": "لأ. المسار بيبدأ من مرحلة \"عندي فكرة\" أو حتى \"عايز أبدأ ومش عارف إيه\"، ويمشي معاك للتنفيذ.",
        "aEn": "No. The course begins at the idea stage and guides you through lean validation before spending significant capital."
      },
      {
        "q": "عندي مشروع شغال بالفعل",
        "qEn": "I already have an active business, will this help?",
        "a": "هتستفيد من وحدات التسعير والأرقام والنمو أكتر. تقدر تعدّي بسرعة على الأساسيات وتركّز على اللي ينفعك.",
        "aEn": "Yes, especially the modules on value-based pricing, unit margins, customer retention, and customer acquisition channels."
      },
      {
        "q": "محتاج رأس مال؟",
        "qEn": "Do I need large startup capital?",
        "a": "المسار بيركّز على البدايات الخفيفة — تختبر الفكرة بأقل تكلفة ممكنة قبل ما تحط فلوس جدّية.",
        "aEn": "No. The entire methodology is built around lean bootstrapping — validating demand with minimal cost before investing."
      },
      {
        "q": "هيعلّمني التسعير إزاي؟",
        "qEn": "How does it teach pricing strategy?",
        "a": "فيه دروس كاملة عن ده: إزاي تسعّر بالقيمة مش بالتكلفة، وإزاي تتعامل مع اللي بيفاصل، وإمتى ترفع سعرك.",
        "aEn": "Dedicated lessons guide value-based pricing over cost-plus pricing, objection handling, and confident price increases."
      },
      {
        "q": "إزاي ألاقي أول عميل؟",
        "qEn": "How do I land my first paying customer?",
        "a": "فيه وحدة كاملة عن ده — من تحديد مين عميلك بالظبط، لحد المحادثة الأولى معاه.",
        "aEn": "An entire module covers outbound outreach, warm network activation, and conducting customer discovery conversations that convert."
      },
      {
        "q": "المسار عن مشاريع أونلاين ولا محلات؟",
        "qEn": "Is this for online businesses or physical shops?",
        "a": "المبادئ واحدة والأمثلة بتغطي الاتنين، بس التركيز أكبر على الخدمات والمشاريع الرقمية لأنها الأسرع في البداية.",
        "aEn": "Principles apply to both, with focused examples on digital services and scalable online ventures."
      },
      {
        "q": "فيه دروس عن الأرقام والمحاسبة؟",
        "qEn": "Does it cover financial metrics and accounting?",
        "a": "أيوة، بس من غير تعقيد. الأرقام القليلة اللي فعلًا بتفرق: هامش الربح، تكلفة العميل، ونقطة التعادل.",
        "aEn": "Yes, focusing on the metrics that truly matter: gross margin, customer acquisition cost (CAC), and break-even points."
      },
      {
        "q": "إزاي أعرف إن فكرتي كويسة؟",
        "qEn": "How do I know if my business idea is actually good?",
        "a": "المسار بيعلّمك تختبرها قبل ما تبنيها. أغلب المشاريع بتفشل لأنها بنت حاجة محدش عايزها، مش لأن التنفيذ كان وحش.",
        "aEn": "You will learn pre-commitment validation frameworks to ensure market demand exists before building the product."
      }
    ]
  },
  {
    "key": "track-mindset",
    "title": "مسار نمط النجاح",
    "titleEn": "Success Mindset & Habit Mastery Track",
    "icon": "🧠",
    "items": [
      {
        "q": "ده مسار كلام تحفيزي؟",
        "qEn": "Is this just motivational quotes?",
        "a": "لأ، والعكس. مفيش اقتباسات ولا حماس فاضي. المسار عن أنظمة عملية: مسؤولية، هوية، تركيز، عادات، بيئة، واستمرارية.",
        "aEn": "The exact opposite. Zero empty hype. The course is built on behavioral systems: identity, environment design, and friction reduction."
      },
      {
        "q": "إيه اللي هيتغير فيّا فعلًا؟",
        "qEn": "What tangible changes will I experience?",
        "a": "الطريقة اللي بتاخد بيها قرارات وبتنفّذ بيها. الفرق بين اللي بينجز واللي مش بينجز نادرًا بيكون معلومات — غالبًا بيكون نظام.",
        "aEn": "A dramatic shift in how you make daily decisions and execute. Successful people differ not in knowledge, but in operational systems."
      },
      {
        "q": "أنا مجرّب كتب تطوير ذات كتير",
        "qEn": "I've read many self-improvement books without lasting change",
        "a": "الفرق هنا إن كل يوم فيه مهمة تنفّذها فعلًا، مش فصل تقراه وتنساه. المعرفة اللي مش بتتحوّل لسلوك مش بتفرق.",
        "aEn": "Because books offer passive reading. Here, every day requires a 5-minute action that embeds behavior into daily routine."
      },
      {
        "q": "هيساعدني على التسويف؟",
        "qEn": "Will this help overcome procrastination?",
        "a": "أيوة، فيه وحدة كاملة عن التركيز والتسويف — بس من زاوية البيئة والأنظمة، مش من زاوية \"حاول أكتر\".",
        "aEn": "Yes, an entire module deconstructs procrastination through environmental constraints rather than relying on willpower."
      },
      {
        "q": "إزاي أبني عادة تفضل معايا؟",
        "qEn": "How do I build habits that stick permanently?",
        "a": "دي وحدة كاملة في المسار: حجم الخطوة، الربط بعادة موجودة، وتصميم البيئة. الإرادة آخر حاجة بنعتمد عليها.",
        "aEn": "By learning habit stacking, micro-commitments, and friction optimization. Willpower is the last thing we rely on."
      },
      {
        "q": "المسار ده الأول ولا بعد المسارات التانية؟",
        "qEn": "Should I take this track before or after skill tracks?",
        "a": "لو بتلاقي صعوبة في الاستمرار في أي حاجة، ابدأ بيه. لو عايز مهارة سوق سريعة، ابدأ بالذكاء الاصطناعي وخُد ده بعده.",
        "aEn": "If you struggle with consistency, take this first. If you need immediate marketable skills, start with AI and take this alongside it."
      },
      {
        "q": "فيه حاجة عن إدارة الوقت؟",
        "qEn": "Does this cover time management?",
        "a": "أيوة، بس من زاوية الأولويات والطاقة مش الجداول. أغلب مشاكل الوقت هي في الحقيقة مشاكل وضوح.",
        "aEn": "Yes, through energy management and priority architecture. Most 'time' problems are actually priority clarity problems."
      },
      {
        "q": "محتوى نمط النجاح مبني على إيه؟",
        "qEn": "What research is this based on?",
        "a": "على أبحاث علم النفس السلوكي وعلوم العادات، متلخّصة في خطوات تنفيذية بدل نظريات.",
        "aEn": "Behavioral psychology, habit research from Stanford and UCL, and cognitive systems synthesized into actionable playbooks."
      },
      {
        "q": "ينفع لحد بيمر بفترة صعبة؟",
        "qEn": "Is this a substitute for therapy or medical care?",
        "a": "المسار عن بناء أنظمة، مش بديل عن دعم نفسي متخصص. لو بتمر بضغط نفسي حقيقي، ده أولى.",
        "aEn": "No. This is educational coaching on productivity and habit architecture, not clinical therapy."
      }
    ]
  },
  {
    "key": "track-health",
    "title": "مسار الصحة والطاقة",
    "titleEn": "Health, Energy & Vitality Track",
    "icon": "💪",
    "items": [
      {
        "q": "المسار ده عن الرجيم؟",
        "qEn": "Is this a crash diet program?",
        "a": "لأ. عن بناء نظام تفهمه وتقدر تكمّل عليه: نوم، تغذية، حركة، وطاقة. مفيش نظام غذائي صارم ولا وعود بخسارة سريعة.",
        "aEn": "No. It is a sustainable lifestyle system covering sleep architecture, real nutrition, functional movement, and daily energy management."
      },
      {
        "q": "محتاج جيم أو أدوات؟",
        "qEn": "Do I need a gym membership or special equipment?",
        "a": "لأ. الحركة في المسار مصممة تتنفّذ في البيت من غير أي أدوات. لو بتروح جيم، هتستفيد كمان.",
        "aEn": "No. All movement protocols are designed for home execution with zero equipment required."
      },
      {
        "q": "هخس كام كيلو؟",
        "qEn": "How much weight will I lose?",
        "a": "المسار مش بيوعد برقم. بيبني عادات لو استمريت عليها النتيجة بتيجي — والوعود بالأرقام السريعة هي بالظبط اللي بتخلي الناس ترجع لنقطة الصفر.",
        "aEn": "The track focuses on sustainable metabolic habits rather than arbitrary scale promises that lead to rebound weight gain."
      },
      {
        "q": "عندي مشكلة في النوم",
        "qEn": "I suffer from poor sleep and insomnia",
        "a": "فيه وحدة كاملة عن النوم: الميعاد، الضوء، الكافيين، وإزاي تصلّح ساعتك البيولوجية من غير أدوية.",
        "aEn": "A full module covers circadian rhythms: morning light exposure, caffeine half-life, temperature optimization, and wind-down rituals."
      },
      {
        "q": "بحس بخمول طول اليوم",
        "qEn": "I feel sluggish and fatigued throughout the day",
        "a": "الطاقة موضوع أساسي في المسار — من النوم والأكل والحركة والماء، بترتيب الأولوية الصح مش عشوائي.",
        "aEn": "Energy management is our core theme: hydration, stable glucose responses, and post-lunch recovery protocols."
      },
      {
        "q": "محتوى الصحة مبني على إيه؟",
        "qEn": "What scientific standards are used?",
        "a": "على إرشادات منظمة الصحة العالمية ومصادر طبية موثوقة، مبسّطة لخطوات يومية.",
        "aEn": "Guidelines from the World Health Organization and peer-reviewed clinical physiology, simplified into practical daily actions."
      },
      {
        "q": "عندي حالة مرضية، ينفع أتابع المسار؟",
        "qEn": "I have a medical condition, can I follow along?",
        "a": "المسار تعليمي ومش بديل عن استشارة طبية. لو عندك حالة مزمنة أو بتاخد أدوية، اسأل دكتورك قبل ما تغيّر أي حاجة في أكلك أو نشاطك.",
        "aEn": "This curriculum is educational. Always consult your personal physician before making dietary or physical routine changes."
      },
      {
        "q": "بيتكلم عن المكمّلات؟",
        "qEn": "Does the course recommend supplements?",
        "a": "بشكل محدود جدًا وبواقعية. الأساسيات (النوم والأكل والحركة) بتفرق أضعاف أي مكمّل.",
        "aEn": "Very conservatively and pragmatically. Fundamental sleep, nutrition, and movement outperform supplements by 10x."
      },
      {
        "q": "أنا مشغول جدًا، هينفع؟",
        "qEn": "I have a very busy schedule, can I fit this in?",
        "a": "المهام اليومية 5-15 دقيقة زي باقي المسارات. المسار متصمم أصلًا للناس المشغولة، مش لناس فاضية.",
        "aEn": "Daily lessons take only 5-15 minutes. This track was engineered specifically for busy working professionals."
      }
    ]
  }
];
