import fs from 'fs';
import path from 'path';

// Master data mapping all 100 courses to their unique artwork, alt text, and badges
const TRACKS_ARTWORK_DATA = [
  // --- Stage 1: AI & Prompts (Tracks 1 - 10) ---
  {
    slug: 'prompt-engineering-mastery',
    image: '/images/tracks/prompt-engineering-mastery.jpg',
    altAr: 'هندسة الأوامر والشبكات العصبية للذكاء الاصطناعي ثلاثية الأبعاد',
    altEn: '3D Holographic AI Neural Pathways & Advanced Prompt Engineering',
    badgeAr: 'هندسة الأوامر',
    badgeEn: 'Prompt Engineering',
  },
  {
    slug: 'autonomous-ai-agents',
    image: '/images/tracks/autonomous-ai-agents.jpg',
    altAr: 'وكلاء الذكاء الاصطناعي المستقلون والأنظمة الذاتية متعددة الوكلاء',
    altEn: 'Autonomous AI Agents & Multi-Agent Holographic Systems',
    badgeAr: 'وكلاء الذكاء الاصطناعي',
    badgeEn: 'AI Agents',
  },
  {
    slug: 'ai-media-midjourney',
    image: '/images/tracks/ai-media-midjourney.jpg',
    altAr: 'توليد الصور والميديا الرقمية ثلاثية الأبعاد بـ Midjourney و Flux',
    altEn: 'Generative AI Digital Art & Midjourney Studio',
    badgeAr: 'توليد الميديا بالـ AI',
    badgeEn: 'AI Media Generation',
  },
  {
    slug: 'ai-video-creation',
    image: '/images/tracks/ai-video-creation.jpg',
    altAr: 'صناعة الفيديو والأنيميشن السينمائي بالذكاء الاصطناعي',
    altEn: 'Cinematic AI Video Creation & Motion Generation',
    badgeAr: 'صناعة الفيديو بالـ AI',
    badgeEn: 'AI Video Creation',
  },
  {
    slug: 'ai-workplace-productivity',
    image: '/images/tracks/ai-workplace-productivity.jpg',
    altAr: 'مضاعفة إنتاجية العمل وسير المهام اليومية بالذكاء الاصطناعي',
    altEn: 'AI Workplace Productivity & Automated Workflow Hub',
    badgeAr: 'الإنتاجية الذكية',
    badgeEn: 'Workplace AI',
  },
  {
    slug: 'no-code-ai-apps',
    image: '/images/tracks/no-code-ai-apps.jpg',
    altAr: 'بناء تطبيقات وأنظمة ذكية بدون كتابة كود برمجي',
    altEn: 'No-Code AI Application Development & Visual Pipelines',
    badgeAr: 'تطبيقات بدون كود',
    badgeEn: 'No-Code AI',
  },
  {
    slug: 'local-llms-open-source',
    image: '/images/tracks/local-llms-open-source.jpg',
    altAr: 'تشغيل النماذج اللغوية المحلية والسرية مفتوحة المصدر',
    altEn: 'Local Private LLMs & Open Source Offline Rigs',
    badgeAr: 'النماذج المحلية والسرية',
    badgeEn: 'Private LLMs',
  },
  {
    slug: 'ai-chatbots-business',
    image: '/images/tracks/ai-chatbots-business.jpg',
    altAr: 'روبوتات محادثة المؤسسات واسترجاع المعرفة المتقدم RAG',
    altEn: 'Enterprise RAG Chatbots & Vector Knowledge Bases',
    badgeAr: 'شات بوت الشركات',
    badgeEn: 'Enterprise RAG',
  },
  {
    slug: 'ai-copywriting-scripts',
    image: '/images/tracks/ai-copywriting-scripts.jpg',
    altAr: 'كتابة الإعلانات والسكريبتات الإبداعية عالية التحويل بالـ AI',
    altEn: 'AI High-Converting Copywriting & Creative Storytelling',
    badgeAr: 'صياغة الإعلانات بالـ AI',
    badgeEn: 'AI Copywriting',
  },
  {
    slug: 'ai-ethics-governance',
    image: '/images/tracks/ai-ethics-governance.jpg',
    altAr: 'حوكمة الذكاء الاصطناعي والامتثال الأخلاقي والأمني للشركات',
    altEn: 'AI Ethics, Corporate Governance & Risk Assessment',
    badgeAr: 'حوكمة وأخلاقيات الـ AI',
    badgeEn: 'AI Governance',
  },

  // --- Stage 2: Software & Web Development (Tracks 11 - 20) ---
  {
    slug: 'modern-coding-fundamentals',
    image: '/images/tracks/modern-coding-fundamentals.jpg',
    altAr: 'أساسيات البرمجة الحديثة والتفكير الخوارزمي وهياكل البيانات',
    altEn: 'Modern Coding Fundamentals & Algorithmic Architecture',
    badgeAr: 'أساسيات البرمجة',
    badgeEn: 'Coding Fundamentals',
  },
  {
    slug: 'frontend-react-nextjs',
    image: '/images/tracks/frontend-react-nextjs.jpg',
    altAr: 'هندسة واجهات الويب الحديثة وتطبيقات Next.js و React',
    altEn: 'Modern Frontend Engineering with Next.js & React',
    badgeAr: 'تطوير واجهات React',
    badgeEn: 'Next.js Frontend',
  },
  {
    slug: 'backend-nodejs-prisma',
    image: '/images/tracks/backend-nodejs-prisma.jpg',
    altAr: 'تطوير الواجهات الخلفية وقواعد البيانات بـ Node.js و Prisma',
    altEn: 'Enterprise Node.js Backend & Prisma Database Engines',
    badgeAr: 'تطوير الباك إند',
    badgeEn: 'Node.js Backend',
  },
  {
    slug: 'python-automation-scripting',
    image: '/images/tracks/python-automation-scripting.jpg',
    altAr: 'أتمتة الأعمال وسلاسل المهام المعقدة بلغة Python',
    altEn: 'Python Workflow Automation & Advanced Scripting Engine',
    badgeAr: 'أتمتة المهام بـ Python',
    badgeEn: 'Python Automation',
  },
  {
    slug: 'mobile-apps-flutter',
    image: '/images/tracks/mobile-apps-flutter.jpg',
    altAr: 'تطوير تطبيقات الموبايل الهجينة عالية الأداء بـ Flutter و Dart',
    altEn: 'Cross-Platform Mobile App Engineering with Flutter & Dart',
    badgeAr: 'تطبيقات Flutter',
    badgeEn: 'Flutter Mobile',
  },
  {
    slug: 'api-architecture-design',
    image: '/images/tracks/api-architecture-design.jpg',
    altAr: 'معمارية وتصميم واجهات البرمجة RESTful و GraphQL و Microservices',
    altEn: 'RESTful & GraphQL API Architecture & Microservices Gateway',
    badgeAr: 'معمارية الـ APIs',
    badgeEn: 'API Architecture',
  },
  {
    slug: 'cloud-devops-docker',
    image: '/images/tracks/cloud-devops-docker.jpg',
    altAr: 'الحوسبة السحابية وحاويات Docker وخطوط النشر المؤتمتة CI/CD',
    altEn: 'Cloud DevOps, Docker Containerization & CI/CD Pipelines',
    badgeAr: 'ديف أوبس والسحاب',
    badgeEn: 'Cloud DevOps',
  },
  {
    slug: 'secure-web-development',
    image: '/images/tracks/secure-web-development.jpg',
    altAr: 'تطوير وتأمين تطبيقات الويب ضد الثغرات وتشفير البيانات',
    altEn: 'Secure Web Application Engineering & Defensive Coding',
    badgeAr: 'تأمين تطبيقات الويب',
    badgeEn: 'Secure Web Dev',
  },
  {
    slug: 'nocode-web-framer',
    image: '/images/tracks/nocode-web-framer.jpg',
    altAr: 'بناء مواقع استثنائية تفاعلية بـ Framer و Webflow بدون كود',
    altEn: 'High-End Visual Web Design with Framer & Webflow',
    badgeAr: 'مواقع بدون كود',
    badgeEn: 'Visual Framer Dev',
  },
  {
    slug: 'custom-ecommerce-dev',
    image: '/images/tracks/custom-ecommerce-dev.jpg',
    altAr: 'برمجة وبناء منصات المتاجر الإلكترونية وبوابات الدفع المخصصة',
    altEn: 'Custom E-Commerce Platform Architecture & Payment Integrations',
    badgeAr: 'برمجة المتاجر المخصصة',
    badgeEn: 'Custom E-Commerce',
  },

  // --- Stage 3: Data Analytics & Business Intelligence (Tracks 21 - 30) ---
  {
    slug: 'advanced-excel-powerquery',
    image: '/images/tracks/advanced-excel-powerquery.jpg',
    altAr: 'إكسيل المتقدم و Power Query وأتمتة الجداول المالية الكبرى',
    altEn: 'Advanced Excel Power Query & Enterprise Financial Modeling',
    badgeAr: 'إكسيل متقدم',
    badgeEn: 'Advanced Excel',
  },
  {
    slug: 'sql-data-analytics',
    image: '/images/tracks/sql-data-analytics.jpg',
    altAr: 'قواعد البيانات وتحليل البيانات الضخمة باستعلامات SQL المتقدمة',
    altEn: 'Enterprise SQL Databases & Big Data Analytics Engine',
    badgeAr: 'قواعد البيانات SQL',
    badgeEn: 'Enterprise SQL Analytics',
  },
  {
    slug: 'powerbi-tableau-visualization',
    image: '/images/tracks/powerbi-tableau-visualization.jpg',
    altAr: 'لوحة بيانات ذكاء الأعمال التفاعلية ثلاثية الأبعاد بـ Power BI و Tableau',
    altEn: 'Interactive 3D Business Intelligence & Power BI Dashboards',
    badgeAr: 'تصور البيانات Power BI',
    badgeEn: 'Power BI & Tableau',
  },
  {
    slug: 'python-data-science',
    image: '/images/tracks/python-data-science.jpg',
    altAr: 'علم البيانات والتحليل الإحصائي والتنبؤي بـ Python و Pandas',
    altEn: 'Python Data Science, Pandas Analytics & Predictive Modeling',
    badgeAr: 'علم البيانات بايثون',
    badgeEn: 'Python Data Science',
  },
  {
    slug: 'applied-business-statistics',
    image: '/images/tracks/applied-business-statistics.jpg',
    altAr: 'الإحصاء التطبيقي واختبار الفرضيات لاتخاذ القرارات الاستثمارية',
    altEn: 'Applied Business Statistics & Quantitative Hypothesis Testing',
    badgeAr: 'الإحصاء التطبيقي',
    badgeEn: 'Business Statistics',
  },
  {
    slug: 'predictive-analytics-forecasting',
    image: '/images/tracks/predictive-analytics-forecasting.jpg',
    altAr: 'التحليلات التنبؤية والتنبؤ بالسلاسل الزمنية وتدفقات الإيرادات',
    altEn: 'Predictive Analytics, Forecasting & Time Series Projections',
    badgeAr: 'التحليلات التنبؤية',
    badgeEn: 'Predictive Analytics',
  },
  {
    slug: 'data-wrangling-pipelines',
    image: '/images/tracks/data-wrangling-pipelines.jpg',
    altAr: 'هندسة خطوط معالجة وتجهيز وتنظيف البيانات الضخمة (ETL)',
    altEn: 'Automated Data Wrangling, ETL Pipelines & Quality Assurance',
    badgeAr: 'تنظيف وهندسة البيانات',
    badgeEn: 'Data Pipelines',
  },
  {
    slug: 'kpi-dashboards-finance',
    image: '/images/tracks/kpi-dashboards-finance.jpg',
    altAr: 'لوحات مؤشرات الأداء المالي (KPIs) وتحليل العائد وهوامش الربح',
    altEn: 'Financial KPI Dashboards & Executive Profit Margin Analytics',
    badgeAr: 'المؤشرات المالية KPIs',
    badgeEn: 'Financial KPIs',
  },
  {
    slug: 'automated-reporting-analytics',
    image: '/images/tracks/automated-reporting-analytics.jpg',
    altAr: 'أتمتة التقارير الإدارية وتغذية لوحات المتابعة الحية لحظياً',
    altEn: 'Automated Executive Reporting & Live Telemetry Distribution',
    badgeAr: 'أتمتة التقارير',
    badgeEn: 'Automated Reporting',
  },
  {
    slug: 'data-driven-decision-making',
    image: '/images/tracks/data-driven-decision-making.jpg',
    altAr: 'صنع القرارات الاستراتيجية المدعومة بصلابة البيانات وتحليل المخاطر',
    altEn: 'Data-Driven Strategic Decision Making & Evidence Frameworks',
    badgeAr: 'القرارات بالبيانات',
    badgeEn: 'Data Decisions',
  },

  // --- Stage 4: Freelancing & Micro-Agencies (Tracks 31 - 40) ---
  {
    slug: 'zero-to-first-dollar-freelancer',
    image: '/images/tracks/zero-to-first-dollar-freelancer.jpg',
    altAr: 'الانطلاق في العمل الحر وتحقيق أول دخل بالعملات الصعبة',
    altEn: 'Freelancing Blueprint: Zero to First Dollar Breakthrough',
    badgeAr: 'انطلاقة العمل الحر',
    badgeEn: 'Freelance Kickstart',
  },
  {
    slug: 'upwork-fiverr-global-mastery',
    image: '/images/tracks/upwork-fiverr-global-mastery.jpg',
    altAr: 'احتراف منصات Upwork و Fiverr وتصدر نتائج البحث العالمية',
    altEn: 'Global Upwork & Fiverr Platform Domination & Top Rated Status',
    badgeAr: 'احتراف Upwork و Fiverr',
    badgeEn: 'Upwork & Fiverr',
  },
  {
    slug: 'winning-proposals-cold-emailing',
    image: '/images/tracks/winning-proposals-cold-emailing.jpg',
    altAr: 'صياغة عروض العمل الفائزة والمراسلات الباردة لجذب العملاء الكبار',
    altEn: 'High-Converting Client Proposals & Cold Outreach System',
    badgeAr: 'عروض العمل الرابحة',
    badgeEn: 'Winning Proposals',
  },
  {
    slug: 'high-ticket-pricing-packaging',
    image: '/images/tracks/high-ticket-pricing-packaging.jpg',
    altAr: 'تسعير الخدمات المرتفع وتغليف باقات القيمة للعملاء الدوليين',
    altEn: 'High-Ticket Service Pricing & Value-Driven Client Packaging',
    badgeAr: 'التسعير المرتفع',
    badgeEn: 'High-Ticket Pricing',
  },
  {
    slug: 'client-management-retention',
    image: '/images/tracks/client-management-retention.jpg',
    altAr: 'إدارة علاقات العملاء واستبقاؤهم بعقود ولاء شهرية مستدامة',
    altEn: 'Elite Client Retention, Onboarding & Long-Term Contracts',
    badgeAr: 'إدارة واستبقاء العملاء',
    badgeEn: 'Client Retention',
  },
  {
    slug: 'portfolio-building-case-studies',
    image: '/images/tracks/portfolio-building-case-studies.jpg',
    altAr: 'بناء معرض أعمال استثنائي ودراسات حالة مقنعة تبرهن القيمة',
    altEn: 'High-Impact Portfolio Building & Persuasive Case Studies',
    badgeAr: 'معرض الأعمال الفاخر',
    badgeEn: 'Portfolio Mastery',
  },
  {
    slug: 'freelancer-finances-cashflow',
    image: '/images/tracks/freelancer-finances-cashflow.jpg',
    altAr: 'الإدارة المالية للمستقلين وتأمين التدفق النقدي والضرائب والاستثمار',
    altEn: 'Freelance Financial Engine, Cashflow Mastery & Tax Setup',
    badgeAr: 'مالية المستقلين',
    badgeEn: 'Freelance Finances',
  },
  {
    slug: 'freelancer-to-agency-scaling',
    image: '/images/tracks/freelancer-to-agency-scaling.jpg',
    altAr: 'التحول من مستقل فردي إلى وكالة رقمية رائدة وتفويض المهام',
    altEn: 'Scaling from Solo Freelancer to Thriving Boutique Agency',
    badgeAr: 'توسيع الوكالة الرقمية',
    badgeEn: 'Agency Scaling',
  },
  {
    slug: 'global-invoicing-international-clients',
    image: '/images/tracks/global-invoicing-international-clients.jpg',
    altAr: 'الفواتير الدولية واستلام المدفوعات والتعامل مع البنوك العالمية',
    altEn: 'Global Invoicing, Multi-Currency Banking & Cross-Border Rails',
    badgeAr: 'الفوترة والمدفوعات الدولية',
    badgeEn: 'Global Invoicing',
  },
  {
    slug: 'freelance-burnout-prevention',
    image: '/images/tracks/freelance-burnout-prevention.jpg',
    altAr: 'الوقاية من الاحتراق المهني وإدارة التوازن والضغط للمستقلين',
    altEn: 'Freelance Burnout Prevention, Work-Life Balance & Boundary Armor',
    badgeAr: 'التوازن والوقاية من الإجهاد',
    badgeEn: 'Burnout Defense',
  },

  // --- Stage 5: Digital Marketing & Growth (Tracks 41 - 50) ---
  {
    slug: 'integrated-digital-marketing-strategy',
    image: '/images/tracks/integrated-digital-marketing-strategy.jpg',
    altAr: 'استراتيجية التسويق الرقمي المتكامل والنمو الشامل متعدد القنوات',
    altEn: 'Omnichannel Integrated Digital Marketing & Growth Strategy',
    badgeAr: 'استراتيجية التسويق',
    badgeEn: 'Marketing Strategy',
  },
  {
    slug: 'meta-ads-mastery',
    image: '/images/tracks/meta-ads-mastery.jpg',
    altAr: 'إعلانات فيسبوك وإنستغرام المتقدمة واستهداف الجماهير المربحة',
    altEn: 'Meta Ads Mastery, Precision Targeting & High-ROAS Campaigns',
    badgeAr: 'إعلانات Meta المتقدمة',
    badgeEn: 'Meta Ads Mastery',
  },
  {
    slug: 'google-ads-performance-max',
    image: '/images/tracks/google-ads-performance-max.jpg',
    altAr: 'إعلانات جوجل وشبكة البحث وحملات Performance Max الذكية',
    altEn: 'Google Search Ads & AI Performance Max Domination',
    badgeAr: 'إعلانات جوجل الذكية',
    badgeEn: 'Google Ads PMax',
  },
  {
    slug: 'tiktok-ads-viral-marketing',
    image: '/images/tracks/tiktok-ads-viral-marketing.jpg',
    altAr: 'إعلانات تيك توك وصناعة المحتوى الفيروسي سريع الانتشار',
    altEn: 'TikTok Viral Marketing, Ad Formats & Trend Scaling',
    badgeAr: 'إعلانات تيك توك',
    badgeEn: 'TikTok Viral Ads',
  },
  {
    slug: 'modern-seo-semantic-search',
    image: '/images/tracks/modern-seo-semantic-search.jpg',
    altAr: 'تحسين محركات البحث الحديث (SEO) ومحركات الذكاء الاصطناعي والدلالية',
    altEn: 'Modern Semantic SEO & AI Search Engine Optimization',
    badgeAr: 'سيو محركات البحث',
    badgeEn: 'Modern Semantic SEO',
  },
  {
    slug: 'high-converting-copywriting',
    image: '/images/tracks/high-converting-copywriting.jpg',
    altAr: 'كتابة النصوص الإعلانية المقنعة ورفع معدلات التحويل للقصوى',
    altEn: 'High-Converting Persuasive Copywriting & Sales Psychology',
    badgeAr: 'النصوص الإعلانية المقنعة',
    badgeEn: 'Sales Copywriting',
  },
  {
    slug: 'sales-funnels-cro',
    image: '/images/tracks/sales-funnels-cro.jpg',
    altAr: 'أقماع المبيعات المتطورة وتحسين معدلات التحويل (CRO)',
    altEn: 'Sales Funnels Engineering & Conversion Rate Optimization (CRO)',
    badgeAr: 'أقماع المبيعات CRO',
    badgeEn: 'Sales Funnels & CRO',
  },
  {
    slug: 'email-marketing-automation',
    image: '/images/tracks/email-marketing-automation.jpg',
    altAr: 'التسويق عبر البريد الإلكتروني وأتمتة سلاسل الاحتفاظ بالعملاء',
    altEn: 'Email Marketing Automation, Drip Sequences & Lifecycle Retention',
    badgeAr: 'أتمتة البريد الإلكتروني',
    badgeEn: 'Email Automation',
  },
  {
    slug: 'inbound-organic-content',
    image: '/images/tracks/inbound-organic-content.jpg',
    altAr: 'استراتيجية المحتوى العضوي الجاذب وبناء الجمهور دون إعلانات مدفوعة',
    altEn: 'Inbound Organic Content Engine & Zero-Ad Audience Attraction',
    badgeAr: 'المحتوى العضوي',
    badgeEn: 'Inbound Content',
  },
  {
    slug: 'personal-branding-linkedin-x',
    image: '/images/tracks/personal-branding-linkedin-x.jpg',
    altAr: 'بناء العلامة الشخصية الموثوقة على LinkedIn ومنصة X لجذب الفرص',
    altEn: 'Executive Personal Branding on LinkedIn & X for Authority',
    badgeAr: 'العلامة الشخصية المهنية',
    badgeEn: 'Executive Branding',
  },

  // --- Stage 6: UI/UX & Creative Media (Tracks 51 - 60) ---
  {
    slug: 'ui-ux-design-figma',
    image: '/images/tracks/ui-ux-design-figma.jpg',
    altAr: 'تصميم واجهات وتجربة المستخدم الحديثة في Figma',
    altEn: 'Modern UI/UX Interface Design & Interactive Prototyping in Figma',
    badgeAr: 'تصميم الواجهات Figma',
    badgeEn: 'UI/UX with Figma',
  },
  {
    slug: 'user-research-wireframing',
    image: '/images/tracks/user-research-wireframing.jpg',
    altAr: 'أبحاث المستخدمين والمخططات الهيكلية السلكية (Wireframing)',
    altEn: 'Empathetic User Research, User Journeys & Wireframe Architecture',
    badgeAr: 'أبحاث وتخطيط الواجهات',
    badgeEn: 'User Research',
  },
  {
    slug: 'scalable-design-systems',
    image: '/images/tracks/scalable-design-systems.jpg',
    altAr: 'بناء وتوسيع نظم التصميم المتكاملة (Design Systems) للشركات',
    altEn: 'Scalable Enterprise Design Systems & Design Tokens in Figma',
    badgeAr: 'نظم التصميم المتكاملة',
    badgeEn: 'Design Systems',
  },
  {
    slug: 'brand-identity-visual-storytelling',
    image: '/images/tracks/brand-identity-visual-storytelling.jpg',
    altAr: 'بناء الهوية البصرية للعلامات التجارية والسرد القصصي المرئي',
    altEn: 'Holistic Brand Identity Systems & Visual Storytelling',
    badgeAr: 'الهوية البصرية للبراند',
    badgeEn: 'Brand Identity',
  },
  {
    slug: 'short-form-video-editing',
    image: '/images/tracks/short-form-video-editing.jpg',
    altAr: 'مونتاج وصناعة الفيديوهات القصيرة الريلز والتيك توك بـ Premiere و CapCut',
    altEn: 'Fast-Paced Short-Form Video Editing for Reels & TikTok',
    badgeAr: 'مونتاج الفيديو القصير',
    badgeEn: 'Short-Form Video',
  },
  {
    slug: 'motion-graphics-after-effects',
    image: '/images/tracks/motion-graphics-after-effects.jpg',
    altAr: 'الموشن جرافيكس والتحريك الإعلاني التفاعلي بـ After Effects',
    altEn: 'Kinetic Motion Graphics & Commercial Animation in After Effects',
    badgeAr: 'الموشن جرافيكس',
    badgeEn: 'Motion Graphics',
  },
  {
    slug: '3d-design-blender-basics',
    image: '/images/tracks/3d-design-blender-basics.jpg',
    altAr: 'التصميم ثلاثي الأبعاد والنمذجة والإضاءة ببرنامج Blender',
    altEn: '3D Product Modeling, Material Shading & Lighting in Blender',
    badgeAr: 'التصميم ثلاثي الأبعاد Blender',
    badgeEn: '3D Blender Modeling',
  },
  {
    slug: 'thumbnail-ad-creative-design',
    image: '/images/tracks/thumbnail-ad-creative-design.jpg',
    altAr: 'تصميم الصور المصغرة والبانرات الإعلانية التي تجبر على النقر (CTR)',
    altEn: 'High-CTR YouTube Thumbnails & High-Converting Ad Creatives',
    badgeAr: 'تصميم الصور المصغرة',
    badgeEn: 'High-CTR Thumbnails',
  },
  {
    slug: 'audio-podcasting-sound-design',
    image: '/images/tracks/audio-podcasting-sound-design.jpg',
    altAr: 'هندسة الصوت الاحترافية للبودكاست والميديا والمؤثرات الصوتية',
    altEn: 'Studio Audio Engineering, Podcasting & Cinematic Sound Design',
    badgeAr: 'هندسة الصوت والبودكاست',
    badgeEn: 'Sound Engineering',
  },
  {
    slug: 'creative-direction-pitching',
    image: '/images/tracks/creative-direction-pitching.jpg',
    altAr: 'الإدارة الإبداعية وتوجيه الفرق وتقديم الأفكار للعملاء الكبار',
    altEn: 'Visionary Creative Direction & High-Stakes Campaign Pitching',
    badgeAr: 'الإدارة الإبداعية',
    badgeEn: 'Creative Direction',
  },

  // --- Stage 7: Entrepreneurship & Startups (Tracks 61 - 70) ---
  {
    slug: 'idea-validation-product-market-fit',
    image: '/images/tracks/idea-validation-product-market-fit.jpg',
    altAr: 'التحقق من صحة فكرة المشروع والوصول للملاءمة مع السوق (PMF)',
    altEn: 'Startup Idea Validation, Traction Testing & Product-Market Fit',
    badgeAr: 'التحقق من الفكرة و PMF',
    badgeEn: 'Product-Market Fit',
  },
  {
    slug: 'business-model-canvas-monetization',
    image: '/images/tracks/business-model-canvas-monetization.jpg',
    altAr: 'مخطط نموذج العمل التجاري وتصميم نماذج الربحية المستدامة',
    altEn: 'Business Model Canvas & High-Margin Monetization Architecture',
    badgeAr: 'نموذج العمل التجاري',
    badgeEn: 'Business Canvas',
  },
  {
    slug: 'building-launching-mvp',
    image: '/images/tracks/building-launching-mvp.jpg',
    altAr: 'بناء وإطلاق النموذج الأولي القابل للتطبيق (MVP) بأسرع وقت',
    altEn: 'Rapid Lean MVP Development & High-Velocity Market Launch',
    badgeAr: 'إطلاق النموذج الأولي MVP',
    badgeEn: 'MVP Launchpad',
  },
  {
    slug: 'zero-budget-traction-growth',
    image: '/images/tracks/zero-budget-traction-growth.jpg',
    altAr: 'النمو الذاتي وجذب أول 1,000 عميل بميزانية صفرية',
    altEn: 'Bootstrapping & Zero-Budget Customer Acquisition Traction',
    badgeAr: 'النمو الذاتي للمشاريع',
    badgeEn: 'Bootstrapping Growth',
  },
  {
    slug: 'b2b-sales-pipeline-crm',
    image: '/images/tracks/b2b-sales-pipeline-crm.jpg',
    altAr: 'إدارة خطوط المبيعات بين الشركات (B2B) وأنظمة الـ CRM وإغلاق الصفقات',
    altEn: 'Enterprise B2B Sales Pipeline, CRM Infrastructure & Deal Closing',
    badgeAr: 'مبيعات الشركات B2B',
    badgeEn: 'B2B Sales Pipeline',
  },
  {
    slug: 'pitch-decks-fundraising-basics',
    image: '/images/tracks/pitch-decks-fundraising-basics.jpg',
    altAr: 'تصميم العروض التقديمية الاستثمارية وجولات جمع التمويل من المستثمرين',
    altEn: 'Investor Pitch Decks, Venture Capital Dynamics & Term Sheets',
    badgeAr: 'العروض الاستثمارية والتمويل',
    badgeEn: 'Investor Pitching',
  },
  {
    slug: 'unit-economics-startup-finance',
    image: '/images/tracks/unit-economics-startup-finance.jpg',
    altAr: 'اقتصاديات الوحدة (Unit Economics) والمحاسبة والربحية للشركات الناشئة',
    altEn: 'Startup Financial Modeling, Unit Economics (CAC/LTV) & Cash Runway',
    badgeAr: 'اقتصاديات الوحدة والمالية',
    badgeEn: 'Unit Economics',
  },
  {
    slug: 'remote-team-hiring-leadership',
    image: '/images/tracks/remote-team-hiring-leadership.jpg',
    altAr: 'بناء وتوظيف وقيادة فرق العمل عن بعد بكفاءة وثقافة عالية',
    altEn: 'High-Performance Remote Team Building, Hiring & Culture Design',
    badgeAr: 'قيادة الفرق عن بعد',
    badgeEn: 'Remote Leadership',
  },
  {
    slug: 'ecommerce-store-supply-chain',
    image: '/images/tracks/ecommerce-store-supply-chain.jpg',
    altAr: 'سلاسل الإمداد وإدارة الشحن والمخزون للمتاجر الإلكترونية',
    altEn: 'E-Commerce Supply Chain, Global Sourcing & Warehouse Logistics',
    badgeAr: 'سلاسل الإمداد للمتاجر',
    badgeEn: 'E-Commerce Supply',
  },
  {
    slug: 'crisis-management-business-resilience',
    image: '/images/tracks/crisis-management-business-resilience.jpg',
    altAr: 'إدارة الأزمات والصلابة المؤسسية واستمرارية الأعمال في الظروف الصعبة',
    altEn: 'Crisis Management, Strategic Resilience & Operational Continuity',
    badgeAr: 'إدارة الأزمات والصلابة',
    badgeEn: 'Crisis Resilience',
  },

  // --- Stage 8: Cybersecurity & Defense (Tracks 71 - 80) ---
  {
    slug: 'personal-cyber-hygiene-opsec',
    image: '/images/tracks/personal-cyber-hygiene-opsec.jpg',
    altAr: 'الأمن الرقمي الشخصي وحماية الخصوصية والهوية التشغيلية (OpSec)',
    altEn: 'Personal Cybersecurity, Privacy Hardening & Tactical OpSec',
    badgeAr: 'الأمن الرقمي الشخصي',
    badgeEn: 'Cyber Hygiene',
  },
  {
    slug: 'computer-networking-fundamentals',
    image: '/images/tracks/computer-networking-fundamentals.jpg',
    altAr: 'أساسيات شبكات الحاسوب والبروتوكولات وتحليل حزم البيانات',
    altEn: 'Computer Networking Fundamentals, TCP/IP & Packet Analysis',
    badgeAr: 'شبكات الحاسوب',
    badgeEn: 'Networking Basics',
  },
  {
    slug: 'ethical-hacking-penetration-testing',
    image: '/images/tracks/ethical-hacking-penetration-testing.jpg',
    altAr: 'القرصنة الأخلاقية واختبار الاختراق واكتشاف ثغرات الأنظمة',
    altEn: 'Ethical Hacking, Penetration Testing & Defensive Vulnerability Labs',
    badgeAr: 'القرصنة الأخلاقية',
    badgeEn: 'Ethical Hacking',
  },
  {
    slug: 'cloud-security-essentials',
    image: '/images/tracks/cloud-security-essentials.jpg',
    altAr: 'تأمين البنية السحابية وإدارة أمن AWS و Google Cloud و Azure',
    altEn: 'Cloud Infrastructure Security & Multi-Cloud Defense Bastions',
    badgeAr: 'أمن الحوسبة السحابية',
    badgeEn: 'Cloud Security',
  },
  {
    slug: 'threat-detection-incident-response',
    image: '/images/tracks/threat-detection-incident-response.jpg',
    altAr: 'رصد التهديدات السيبرانية وغرف العمليات الأمنية (SOC) والاستجابة للحوادث',
    altEn: 'SOC Threat Detection, Real-Time Telemetry & Incident Response',
    badgeAr: 'رصد التهديدات والاستجابة',
    badgeEn: 'Incident Response',
  },
  {
    slug: 'endpoint-enterprise-security',
    image: '/images/tracks/endpoint-enterprise-security.jpg',
    altAr: 'تأمين الأجهزة الطرفية وحماية شبكات المؤسسات وجدران الحماية',
    altEn: 'Enterprise Endpoint Security, Zero Trust & Perimeter Armor',
    badgeAr: 'أمن الأجهزة والمؤسسات',
    badgeEn: 'Endpoint Security',
  },
  {
    slug: 'social-engineering-antiphishing',
    image: '/images/tracks/social-engineering-antiphishing.jpg',
    altAr: 'الحماية من الهندسة الاجتماعية والتصيد الاحتيالي واختراق العقول',
    altEn: 'Social Engineering Defense, Phishing Neutralization & Human Firewall',
    badgeAr: 'مكافحة الهندسة الاجتماعية',
    badgeEn: 'Anti-Phishing',
  },
  {
    slug: 'data-privacy-gdpr-compliance',
    image: '/images/tracks/data-privacy-gdpr-compliance.jpg',
    altAr: 'خصوصية البيانات والامتثال للوائح العالمية GDPR ومعايير الحماية',
    altEn: 'Data Privacy Architecture, GDPR Compliance & Sovereign Protection',
    badgeAr: 'خصوصية البيانات GDPR',
    badgeEn: 'GDPR Compliance',
  },
  {
    slug: 'identity-access-management-iam',
    image: '/images/tracks/identity-access-management-iam.jpg',
    altAr: 'إدارة الهويات وصلاحيات الوصول (IAM) والمصادقة متعددة العوامل',
    altEn: 'Identity and Access Management (IAM), SSO & Zero-Trust Access',
    badgeAr: 'إدارة الهويات IAM',
    badgeEn: 'IAM Architecture',
  },
  {
    slug: 'applied-cryptography-secure-comms',
    image: '/images/tracks/applied-cryptography-secure-comms.jpg',
    altAr: 'علم التشفير التطبيقي وحماية الاتصالات وسلاسل الكتل الرياضية',
    altEn: 'Applied Cryptography, Zero-Knowledge Proofs & Secure Channels',
    badgeAr: 'التشفير التطبيقي',
    badgeEn: 'Applied Cryptography',
  },

  // --- Stage 9: Soft Skills & Leadership (Tracks 81 - 90) ---
  {
    slug: 'art-of-persuasion-influence',
    image: '/images/tracks/art-of-persuasion-influence.jpg',
    altAr: 'فن الإقناع والتأثير القيادي وبناء التوافق الفكري',
    altEn: 'Art of Persuasion, Ethical Influence & High-Stakes Conviction',
    badgeAr: 'فن الإقناع والتأثير',
    badgeEn: 'Persuasion & Influence',
  },
  {
    slug: 'public-speaking-presentations',
    image: '/images/tracks/public-speaking-presentations.jpg',
    altAr: 'الخطابة الجماهيرية والعروض التقديمية المؤثرة أمام الجمهور',
    altEn: 'Masterclass Public Speaking & Electrifying Stage Presentations',
    badgeAr: 'الخطابة والعروض الجماهيرية',
    badgeEn: 'Public Speaking',
  },
  {
    slug: 'emotional-intelligence-workplace',
    image: '/images/tracks/emotional-intelligence-workplace.jpg',
    altAr: 'الذكاء العاطفي والاجتماعي في بيئة العمل وإدارة المشاعر',
    altEn: 'Workplace Emotional Intelligence (EQ) & Social Harmony Matrix',
    badgeAr: 'الذكاء العاطفي المهني',
    badgeEn: 'Emotional Intelligence',
  },
  {
    slug: 'high-stakes-salary-negotiation',
    image: '/images/tracks/high-stakes-salary-negotiation.jpg',
    altAr: 'استراتيجيات التفاوض المتقدم على الرواتب والصفقات الكبرى',
    altEn: 'High-Stakes Compensation Negotiation & Deal-Making Leverage',
    badgeAr: 'التفاوض على الرواتب والصفقات',
    badgeEn: 'Salary Negotiation',
  },
  {
    slug: 'critical-thinking-structured-problem-solving',
    image: '/images/tracks/critical-thinking-structured-problem-solving.jpg',
    altAr: 'التفكير النقدي وحل المشكلات المعقدة بأطر التفكير المنطقي',
    altEn: 'Structured Critical Thinking, First-Principles & Root-Cause Logic',
    badgeAr: 'التفكير النقدي وحل المشكلات',
    badgeEn: 'Critical Thinking',
  },
  {
    slug: 'assertive-communication-conflict-resolution',
    image: '/images/tracks/assertive-communication-conflict-resolution.jpg',
    altAr: 'التواصل الحازم وحل النزاعات المهنية بذكاء ودبلوماسية',
    altEn: 'Assertive Communication & Diplomatic Conflict Resolution',
    badgeAr: 'التواصل الحازم وفض النزاعات',
    badgeEn: 'Conflict Resolution',
  },
  {
    slug: 'business-storytelling-leaders',
    image: '/images/tracks/business-storytelling-leaders.jpg',
    altAr: 'السرد القصصي في الأعمال وإلهام الفرق وتحفيز العمل',
    altEn: 'Strategic Business Storytelling & Transformational Leadership',
    badgeAr: 'السرد القصصي للقادة',
    badgeEn: 'Business Storytelling',
  },
  {
    slug: 'career-transitions-adaptability',
    image: '/images/tracks/career-transitions-adaptability.jpg',
    altAr: 'التحول المهني الذكي والمرونة والتأقلم مع متغيرات سوق العمل',
    altEn: 'Strategic Career Pivots, Skill Portability & Adaptive Agility',
    badgeAr: 'التحول المهني والمرونة',
    badgeEn: 'Career Pivots',
  },
  {
    slug: 'mentorship-coaching-culture',
    image: '/images/tracks/mentorship-coaching-culture.jpg',
    altAr: 'التوجيه الإرشادي والتدريب وبناء ثقافة التطوير المستمر',
    altEn: 'Executive Mentorship, Coaching Mastery & Talent Cultivation',
    badgeAr: 'التوجيه والإرشاد المؤسسي',
    badgeEn: 'Executive Coaching',
  },
  {
    slug: 'strategic-networking-relationships',
    image: '/images/tracks/strategic-networking-relationships.jpg',
    altAr: 'بناء شبكات العلاقات الاستراتيجية وشراكات القيمة المتبادلة',
    altEn: 'Strategic High-Value Networking & Relationship Capital',
    badgeAr: 'شبكات العلاقات الاستراتيجية',
    badgeEn: 'Strategic Networking',
  },

  // --- Stage 10: Productivity & Mindset (Tracks 91 - 100) ---
  {
    slug: 'atomic-habits-relentless-focus',
    image: '/images/tracks/atomic-habits-relentless-focus.jpg',
    altAr: 'العادات الذرية والتركيز الفولاذي ومضاعفة الإنجاز اليومي',
    altEn: 'Atomic Habits Engineering & Unstoppable Daily Momentum',
    badgeAr: 'العادات الذرية والتركيز',
    badgeEn: 'Atomic Habits',
  },
  {
    slug: 'deep-work-flow-state-mastery',
    image: '/images/tracks/deep-work-flow-state-mastery.jpg',
    altAr: 'العمل العميق والدخول في حالة التدفق الذهني الفائقة (Flow State)',
    altEn: 'Deep Work Architecture & Peak Flow State Mastery',
    badgeAr: 'العمل العميق والتدفق الذهني',
    badgeEn: 'Deep Work Flow',
  },
  {
    slug: 'time-blocking-prioritization-eisenhower',
    image: '/images/tracks/time-blocking-prioritization-eisenhower.jpg',
    altAr: 'جدولة الوقت بمصفوفة أيزنهاور وترتيب الأولويات بدقة متناهية',
    altEn: 'Precision Time Blocking & Eisenhower Priority Matrix Engine',
    badgeAr: 'جدولة الوقت والأولويات',
    badgeEn: 'Time Blocking',
  },
  {
    slug: 'curing-procrastination-biases',
    image: '/images/tracks/curing-procrastination-biases.jpg',
    altAr: 'علاج التسويف والمماطلة وتفكيك التحيزات الذهنية المعطلة',
    altEn: 'Overcoming Procrastination & Dismantling Cognitive Biases',
    badgeAr: 'علاج التسويف والمماطلة',
    badgeEn: 'Curing Procrastination',
  },
  {
    slug: 'energy-management-sleep-architecture',
    image: '/images/tracks/energy-management-sleep-architecture.jpg',
    altAr: 'إدارة الطاقة الحيوية وهندسة النوم والنشاط المستدام للرواد',
    altEn: 'Circadian Energy Architecture, Deep Sleep & Peak Vitality',
    badgeAr: 'إدارة الطاقة وهندسة النوم',
    badgeEn: 'Energy & Sleep',
  },
  {
    slug: 'overcoming-imposter-syndrome',
    image: '/images/tracks/overcoming-imposter-syndrome.jpg',
    altAr: 'التغلب على متلازمة المحتال وبناء الثقة بالنفس والاعتزاز بالذات',
    altEn: 'Neutralizing Imposter Syndrome & Forging Unshakeable Self-Worth',
    badgeAr: 'التغلب على متلازمة المحتال',
    badgeEn: 'Overcoming Imposter',
  },
  {
    slug: 'digital-minimalism-attention-protection',
    image: '/images/tracks/digital-minimalism-attention-protection.jpg',
    altAr: 'البساطة الرقمية وحماية الانتباه والتركيز من المشتتات التقنية',
    altEn: 'Digital Minimalism, Attention Sovereignty & Information Detox',
    badgeAr: 'البساطة الرقمية والانتباه',
    badgeEn: 'Digital Minimalism',
  },
  {
    slug: 'growth-mindset-psychological-grit',
    image: '/images/tracks/growth-mindset-psychological-grit.jpg',
    altAr: 'عقلية النمو والمثابرة النفسية الصلبة وتحويل الإخفاق لانتصار',
    altEn: 'Growth Mindset & Indomitable Psychological Grit',
    badgeAr: 'عقلية النمو والمثابرة',
    badgeEn: 'Growth Mindset',
  },
  {
    slug: 'decision-making-under-stress',
    image: '/images/tracks/decision-making-under-stress.jpg',
    altAr: 'اتخاذ القرارات الحاسمة تحت الضغط العالي والغموض بصفاء ذهني',
    altEn: 'High-Pressure Decision Making & Calm Cognitive Clarity',
    badgeAr: 'صنع القرار تحت الضغط',
    badgeEn: 'Decisions Under Pressure',
  },
  {
    slug: 'life-architecture-sustainable-harmony',
    image: '/images/tracks/life-architecture-sustainable-harmony.jpg',
    altAr: 'هندسة الحياة والتناغم المستدام بين الإنجاز والصحة وراحة البال',
    altEn: 'Holistic Life Architecture & Sustainable Long-Term Harmony',
    badgeAr: 'هندسة الحياة المتوازنة',
    badgeEn: 'Life Architecture',
  },
];

// Handcrafted legacy aliases for seamless backward compatibility
const HANDCRAFTED_ALIASES = [
  {
    slug: 'ebni-mansetak',
    image: '/images/tracks/custom-ecommerce-dev.jpg',
    altAr: 'ابنِ منصتك الخاصة: من الصفر للإطلاق',
    altEn: 'Build Your Own Platform: From Zero to Launch',
    badgeAr: 'بناء المنصات',
    badgeEn: 'Platform Architecture',
  },
  {
    slug: 'tahaddi-28-yawm',
    image: '/images/tracks/prompt-engineering-mastery.jpg',
    altAr: 'تحدي 28 يوماً مع الذكاء الاصطناعي',
    altEn: '28-Day AI Transformation Challenge',
    badgeAr: 'تحدي الذكاء الاصطناعي',
    badgeEn: 'AI Challenge',
  },
  {
    slug: 'ai-everyday',
    image: '/images/tracks/ai-workplace-productivity.jpg',
    altAr: 'الذكاء الاصطناعي في العمل اليومي',
    altEn: 'Everyday AI Workflow',
    badgeAr: 'تطبيقات الذكاء الاصطناعي',
    badgeEn: 'Practical AI',
  },
  {
    slug: 'frontend-mastery-react',
    image: '/images/tracks/frontend-react-nextjs.jpg',
    altAr: 'واجهة برمجة الويب وتطبيقات React الحديثة',
    altEn: 'Modern React & Frontend Engineering',
    badgeAr: 'برمجة الواجهات الحديثة',
    badgeEn: 'Modern Frontend',
  },
  {
    slug: 'fullstack-web-modern',
    image: '/images/tracks/backend-nodejs-prisma.jpg',
    altAr: 'تطوير الويب المتكامل الشامل',
    altEn: 'Fullstack Web Development',
    badgeAr: 'التطوير المتكامل الشامل',
    badgeEn: 'Fullstack Web',
  },
  {
    slug: 'growth-marketing-funnels',
    image: '/images/tracks/sales-funnels-cro.jpg',
    altAr: 'قمع المبيعات والتسويق الرقمي والنمو المالي',
    altEn: 'Growth Marketing Funnel & Revenue Intelligence',
    badgeAr: 'أقماع النمو والمبيعات',
    badgeEn: 'Growth Funnels',
  },
  {
    slug: 'freelancing-global-income',
    image: '/images/tracks/zero-to-first-dollar-freelancer.jpg',
    altAr: 'العمل الحر والدخل العالمي',
    altEn: 'Global Freelancing Mastery',
    badgeAr: 'احتراف العمل الحر',
    badgeEn: 'Global Freelancing',
  },
  {
    slug: 'ecommerce-from-scratch',
    image: '/images/tracks/ecommerce-store-supply-chain.jpg',
    altAr: 'التجارة الإلكترونية وبناء المتاجر الرقمية',
    altEn: 'E-commerce & Digital Stores',
    badgeAr: 'التجارة الإلكترونية',
    badgeEn: 'E-Commerce',
  },
  {
    slug: 'ui-ux-figma-mastery',
    image: '/images/tracks/ui-ux-design-figma.jpg',
    altAr: 'تصميم واجهات المستخدم ونظم التصميم في Figma',
    altEn: 'Figma UI/UX Design System',
    badgeAr: 'تصميم الواجهات Figma',
    badgeEn: 'UI/UX Design Systems',
  },
  {
    slug: 'cybersecurity-fundamentals',
    image: '/images/tracks/personal-cyber-hygiene-opsec.jpg',
    altAr: 'أساسيات الأمن السيبراني وحماية الأنظمة',
    altEn: 'Cybersecurity & Cloud Defense Fundamentals',
    badgeAr: 'الأمن السيبراني والدفاع السحابي',
    badgeEn: 'Cybersecurity & Defense',
  },
  {
    slug: 'deep-work-hyperfocus',
    image: '/images/tracks/deep-work-flow-state-mastery.jpg',
    altAr: 'العمل العميق والإنتاجية الفائقة وإدارة الوقت',
    altEn: 'Deep Work, Focus Mastery & Peak Productivity',
    badgeAr: 'الإنتاجية وإدارة الوقت',
    badgeEn: 'Time Mastery & Deep Work',
  },
  {
    slug: 'executive-leadership-presence',
    image: '/images/tracks/business-storytelling-leaders.jpg',
    altAr: 'القيادة التنفيذية واستراتيجيات اتخاذ القرار',
    altEn: 'Executive Leadership & Strategic Decision Making',
    badgeAr: 'القيادة والاستراتيجية',
    badgeEn: 'Executive Strategy',
  },
  {
    slug: 'business-english-career',
    image: '/images/tracks/assertive-communication-conflict-resolution.jpg',
    altAr: 'الإنجليزية المهنية والتواصل الدولي المؤثر',
    altEn: 'International English Communication & Career Elevation',
    badgeAr: 'التواصل واللغة الدولية',
    badgeEn: 'Global Communication',
  },
  {
    slug: 'el-3amal-el-horr',
    image: '/images/tracks/upwork-fiverr-global-mastery.jpg',
    altAr: 'احتراف العمل الحر وبناء الدخل المستقل',
    altEn: 'Freelancing Career Mastery',
    badgeAr: 'العمل الحر',
    badgeEn: 'Freelancing',
  },
  {
    slug: 'kalod-modeer-ebdaay',
    image: '/images/tracks/creative-direction-pitching.jpg',
    altAr: 'المدير الإبداعي بالذكاء الاصطناعي',
    altEn: 'AI Creative Director',
    badgeAr: 'الإدارة الإبداعية',
    badgeEn: 'Creative Direction',
  },
  {
    slug: 'enta-fi-ay-makan',
    image: '/images/tracks/ai-video-creation.jpg',
    altAr: 'أنت في أي مكان: صناعة الفيديو بالذكاء الاصطناعي',
    altEn: 'Be Anywhere: AI Video Production',
    badgeAr: 'صناعة الفيديو',
    badgeEn: 'AI Video',
  },
  {
    slug: 'claude-lel-mashroaat',
    image: '/images/tracks/autonomous-ai-agents.jpg',
    altAr: 'إدارة المشاريع بالذكاء الاصطناعي',
    altEn: 'AI Project Management Mastery',
    badgeAr: 'إدارة المشاريع',
    badgeEn: 'AI Project Management',
  },
  {
    slug: 'bina-el-amal',
    image: '/images/tracks/business-model-canvas-monetization.jpg',
    altAr: 'بناء المشاريع الرقمية والربحية',
    altEn: 'Building Digital Businesses',
    badgeAr: 'ريادة الأعمال',
    badgeEn: 'Digital Business',
  },
  {
    slug: 'nomo-mehany',
    image: '/images/tracks/career-transitions-adaptability.jpg',
    altAr: 'النمو المهني وتطوير المسار الوظيفي',
    altEn: 'Career Acceleration & Growth',
    badgeAr: 'النمو المهني',
    badgeEn: 'Career Growth',
  },
  {
    slug: 'marketing-digital',
    image: '/images/tracks/integrated-digital-marketing-strategy.jpg',
    altAr: 'التسويق الرقمي والنمو',
    altEn: 'Digital Marketing & Growth',
    badgeAr: 'التسويق الرقمي',
    badgeEn: 'Digital Marketing',
  },
  {
    slug: 'data-analysis',
    image: '/images/tracks/powerbi-tableau-visualization.jpg',
    altAr: 'تحليل البيانات وذكاء الأعمال',
    altEn: 'Data Analytics & Business Intelligence',
    badgeAr: 'تحليل البيانات',
    badgeEn: 'Data Analytics',
  },
  {
    slug: 'cybersecurity-basics',
    image: '/images/tracks/personal-cyber-hygiene-opsec.jpg',
    altAr: 'أساسيات الأمن السيبراني',
    altEn: 'Cybersecurity Fundamentals',
    badgeAr: 'الأمن السيبراني',
    badgeEn: 'Cybersecurity',
  },
  {
    slug: 'communication-skills',
    image: '/images/tracks/art-of-persuasion-influence.jpg',
    altAr: 'مهارات التواصل والإقناع',
    altEn: 'Communication & Persuasion Mastery',
    badgeAr: 'مهارات التواصل',
    badgeEn: 'Communication',
  },
  {
    slug: 'productivity-focus',
    image: '/images/tracks/deep-work-flow-state-mastery.jpg',
    altAr: 'الإنتاجية الفائقة والتركيز العميق',
    altEn: 'Peak Productivity & Deep Focus',
    badgeAr: 'الإنتاجية الفائقة',
    badgeEn: 'Peak Productivity',
  },
  {
    slug: 'mindset-growth',
    image: '/images/tracks/growth-mindset-psychological-grit.jpg',
    altAr: 'عقلية النمو والمثابرة',
    altEn: 'Growth Mindset & Mental Resilience',
    badgeAr: 'عقلية النمو',
    badgeEn: 'Growth Mindset',
  },
  {
    slug: 'health-energy',
    image: '/images/tracks/energy-management-sleep-architecture.jpg',
    altAr: 'الصحة وإدارة الطاقة الحيوية',
    altEn: 'Health & Vital Energy Architecture',
    badgeAr: 'الصحة والطاقة',
    badgeEn: 'Health & Energy',
  },
];

console.log(`Verifying uniqueness and files for all ${TRACKS_ARTWORK_DATA.length} primary tracks...`);

if (TRACKS_ARTWORK_DATA.length !== 100) {
  throw new Error(`Expected exactly 100 tracks in TRACKS_ARTWORK_DATA, got ${TRACKS_ARTWORK_DATA.length}`);
}

const seenSlugs = new Set();
const seenImages = new Set();

for (const t of TRACKS_ARTWORK_DATA) {
  if (seenSlugs.has(t.slug)) {
    throw new Error(`Duplicate slug: ${t.slug}`);
  }
  seenSlugs.add(t.slug);

  if (seenImages.has(t.image)) {
    throw new Error(`Duplicate image in 100 courses: ${t.image}`);
  }
  seenImages.add(t.image);

  const localPath = path.join('H:/tawwerni/public', t.image);
  if (!fs.existsSync(localPath)) {
    throw new Error(`Missing image on disk: ${localPath}`);
  }
}

console.log(`ALL 100 TRACKS ARE 100% UNIQUE WITH ZERO IMAGE DUPLICATION AND ALL 100 FILES VERIFIED ON DISK!`);

// Generate the new content for src/content/track-artworks.ts
const fileHeader = `import { ALL_100_TRACKS } from "./tracks100";

export interface TrackArtwork {
  image: string;
  altAr: string;
  altEn: string;
  badgeAr: string;
  badgeEn: string;
}

/**
 * Dedicated custom artworks for every single one of the 100 practical tracks.
 * Every track has its own distinct, 100% unique 3D AI concept artwork with zero duplication.
 */
export const TRACK_ARTWORKS: Record<string, TrackArtwork> = {
`;

let body = '';

for (const t of TRACKS_ARTWORK_DATA) {
  body += `  "${t.slug}": {
    image: "${t.image}",
    altAr: "${t.altAr}",
    altEn: "${t.altEn}",
    badgeAr: "${t.badgeAr}",
    badgeEn: "${t.badgeEn}",
  },
`;
}

body += `
  // Handcrafted legacy and alias mappings for platform consistency
`;

for (const h of HANDCRAFTED_ALIASES) {
  body += `  "${h.slug}": {
    image: "${h.image}",
    altAr: "${h.altAr}",
    altEn: "${h.altEn}",
    badgeAr: "${h.badgeAr}",
    badgeEn: "${h.badgeEn}",
  },
`;
}

const fileFooter = `};

/**
 * Resolves artwork for any track among the 100 tracks.
 * Returns the track's dedicated 3D AI concept artwork.
 */
export function getTrackArtwork(slug?: string): TrackArtwork | null {
  if (!slug) return null;

  // 1. Direct match in TRACK_ARTWORKS (all 100 tracks are explicitly mapped)
  if (TRACK_ARTWORKS[slug]) {
    return TRACK_ARTWORKS[slug];
  }

  // 2. Direct match in ALL_100_TRACKS catalog
  const track = ALL_100_TRACKS.find((t) => t.slug === slug);
  if (track) {
    return {
      image: \`/images/tracks/\${track.slug}.jpg\`,
      altAr: track.titleAr,
      altEn: track.titleEn,
      badgeAr: track.badgeTitleAr,
      badgeEn: track.badgeTitleEn,
    };
  }

  // 3. Fallback for external or undefined courses
  return {
    image: "/images/tracks/prompt-engineering-mastery.jpg",
    altAr: "مسار عملي معتمد في طوّرني",
    altEn: "Practical Track in Tawwerni",
    badgeAr: "مسار معتمد",
    badgeEn: "Verified Practical Track",
  };
}
`;

const finalFileContent = fileHeader + body + fileFooter;

fs.writeFileSync('H:/tawwerni/src/content/track-artworks.ts', finalFileContent, 'utf8');
console.log('Successfully generated H:/tawwerni/src/content/track-artworks.ts with all 100 unique tracks!');
