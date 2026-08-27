/** Localisation.
 *
 *  Two locales ship today: English and Arabic with full RTL. The dictionary is a
 *  plain typed object rather than a runtime i18n library - it is a few hundred
 *  strings, it type-checks at build time, and it costs nothing at runtime.
 *
 *  Error copy is keyed by the backend's stable error codes, so a new failure
 *  mode is one entry per language and never a raw English string on screen.
 */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
/*
 * Arabic is the default here.
 *
 * The upstream project ships both locales behind a `[locale]` route segment.
 * Tawwerni is Arabic-only, so the segment is gone and this constant is what
 * every caller resolves to. The English dictionary stays in the file on
 * purpose: `ar: typeof en` is what makes a missing translation a build error
 * rather than a blank string on screen.
 */
export const defaultLocale: Locale = "ar";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

// Deliberately not `as const`: that would make every value a *literal* type, and
// `ar: typeof en` would then demand the Arabic strings equal the English ones.
// Object literal inference already gives us the exact key set, which is what
// actually needs enforcing — a missing translation must be a build error.
const en = {
  meta: {
    title: "Universal Video Downloader",
    tagline: "Download videos from the web",
    description:
      "Paste a link, see every quality the source actually offers, and download it. Works with YouTube, TikTok, Instagram, X, Vimeo, Reddit and many more.",
  },
  nav: {
    home: "Home",
    theme: "Toggle theme",
    language: "Language",
  },
  hero: {
    title: "Download anything from the web",
    subtitle: "Paste a link. Choose your quality. Download.",
    placeholder: "https://example.com/watch?v=...",
    inputLabel: "Video URL",
    analyze: "Analyze",
    analyzing: "Analyzing...",
    paste: "Paste",
    clear: "Clear",
    supported: "Supported sources",
    supportedMore: "and many more",
  },
  result: {
    quality: "Quality",
    format: "Format",
    video: "Video",
    audio: "Audio",
    advanced: "Advanced",
    advancedHint:
      "Pick an exact stream. Converting between containers may need extra processing.",
    bestAvailable: "Best available",
    audioOnly: "Audio only",
    download: "Download",
    starting: "Starting...",
    duration: "Duration",
    channel: "Channel",
    views: "views",
    size: "Size",
    approxSize: "about",
    unknownSize: "Size unknown",
    presets: "Presets",
    allowTranscode: "Re-encode if the container needs it (slower, may lose quality)",
    noVideoQualities: "This source only offers audio.",
    liveWarning: "Live streams cannot be downloaded.",
  },
  playlist: {
    videos: "videos",
    selected: "selected",
    selectAll: "Select all",
    unselectAll: "Clear selection",
    selectPage: "Select this page",
    downloadSelected: "Download selected",
    creator: "Creator",
    unavailable: "Unavailable",
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",
    truncated:
      "This source has more items than we list at once. The first {count} are shown.",
    limitNote: "Up to {max} videos can be queued in one job.",
  },
  progress: {
    queued: "Waiting in queue",
    analyzing: "Reading the source",
    downloading: "Downloading",
    processing: "Preparing your file",
    completed: "Ready",
    failed: "Failed",
    cancelled: "Cancelled",
    expired: "Expired",
    speed: "Speed",
    eta: "ETA",
    cancel: "Cancel",
    downloadFile: "Download file",
    downloadAll: "Download all as ZIP",
    tryAgain: "Try again",
    startOver: "Start over",
    videosDone: "{done} / {total} videos",
    expiresIn: "This file is removed after {time}.",
    keepOpen: "Keep this page open while the download prepares.",
  },
  history: {
    title: "Recent downloads",
    empty: "Nothing here yet.",
    clear: "Clear history",
    localOnly: "Stored in this browser only.",
  },
  manager: {
    title: "Downloads",
    open: "Open downloads",
    close: "Close",
    transfers: "Transfers",
    files: "Files",
    noTransfers: "No active downloads.",
    noFiles: "Nothing ready yet. Finished downloads appear here.",
    pause: "Pause",
    resume: "Resume",
    cancel: "Cancel",
    retry: "Retry",
    remove: "Remove",
    clearFinished: "Clear finished",
    clearAll: "Clear list",
    selectAll: "Select all",
    selected: "{count} selected",
    zipSelected: "Download selected as ZIP",
    zipAll: "Download all as ZIP",
    preparing: "Preparing archive...",
    connections: "{count} connections",
    accelerated: "Accelerated",
    viaBrowser: "Handed to your browser",
    savedTo: "Saved",
    localOnly: "This list is stored in this browser only.",
    expires: "Expires {time}",
    files_one: "1 file",
    files_many: "{count} files",
    statusQueued: "Waiting",
    statusProbing: "Connecting",
    statusDownloading: "Downloading",
    statusPaused: "Paused",
    statusFinishing: "Saving",
    statusDone: "Done",
    statusError: "Failed",
    statusCancelled: "Cancelled",
    acceleratedHint:
      "Large files download over several connections at once and save straight to disk.",
    browserHint:
      "This one is streamed by your browser — check its own downloads list.",
  },
  errors: {
    generic: "Something went wrong. Please try again.",
    network: "We could not reach the server. Check your connection.",
    invalid_url: "That does not look like a valid link.",
    unsupported_scheme: "Only http and https links are supported.",
    blocked_host: "This address cannot be downloaded.",
    blocked_address: "This address cannot be downloaded.",
    blocked_port: "This address cannot be downloaded.",
    dns_failure: "We could not reach that website.",
    invalid_selection: "Select at least one video first.",
    invalid_format: "That quality is not available for this video.",
    unsupported_source: "This source is not supported yet.",
    no_video_found: "We could not find a downloadable video at this link.",
    auth_required:
      "This video exists but needs an account or permission we do not have.",
    geo_restricted: "This video is not available in our server's region.",
    protected_content: "This video is protected and cannot be downloaded.",
    content_unavailable: "This video is private, removed, or unavailable.",
    live_not_supported: "Live streams cannot be downloaded.",
    extraction_failed: "We could not read this link.",
    extraction_timeout: "The source took too long to respond.",
    file_too_large: "This file is larger than we allow.",
    duration_too_long: "This video is longer than we can process.",
    playlist_too_large: "This playlist has more videos than we can take at once.",
    rate_limited: "Too many requests. Please wait a moment.",
    too_many_active_jobs: "You already have downloads running. Wait for them to finish.",
    queue_full: "The service is busy right now. Please try again shortly.",
    download_failed: "Something went wrong while downloading.",
    processing_failed: "Something went wrong while preparing the file.",
    ffmpeg_missing: "Media processing is unavailable right now.",
    storage_failed: "We could not save the finished file.",
    job_not_found: "This download could not be found.",
    job_not_ready: "This download is not ready yet.",
    job_cancelled: "This download was cancelled.",
    job_expired: "This download expired and was removed.",
    file_missing: "The file is no longer available.",
    forbidden: "Not allowed.",
    internal_error: "An unexpected error occurred.",
  },
  footer: {
    disclaimer: "Only download content you have the right to download.",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "Copyright / DMCA",
    builtWith: "Extraction powered by yt-dlp.",
  },
  seo: {
    youtube: {
      title: "YouTube Video Downloader",
      heading: "Download YouTube videos",
      body: "Paste any YouTube link to see the resolutions the video really offers, from 144p up to 4K and 8K when the source has them, plus audio-only options.",
    },
    playlist: {
      title: "YouTube Playlist & Channel Downloader",
      heading: "Download a playlist or a whole channel",
      body: "Paste a playlist or channel link, pick the videos you want, choose one quality for all of them, and get everything in a single archive.",
    },
    tiktok: {
      title: "TikTok Video Downloader",
      heading: "Download TikTok videos",
      body: "Paste a TikTok link to get the video file in the quality the platform published it in.",
    },
    instagram: {
      title: "Instagram Video & Reels Downloader",
      heading: "Download Instagram videos and reels",
      body: "Works with public reels, posts containing video, and direct video links.",
    },
    twitter: {
      title: "X (Twitter) Video Downloader",
      heading: "Download videos from X",
      body: "Paste a link to a public post that contains video and pick your quality.",
    },
    tryIt: "Try it below",
  },
};

const ar: typeof en = {
  meta: {
    title: "منزّل الفيديو الشامل",
    tagline: "نزّل الفيديوهات من الإنترنت",
    description:
      "الصق الرابط، شاهد كل الجودات التي يوفّرها المصدر فعلاً، ثم نزّل. يدعم يوتيوب وتيك توك وإنستغرام وإكس وفيميو وريديت ومصادر أخرى كثيرة.",
  },
  nav: {
    home: "الرئيسية",
    theme: "تبديل المظهر",
    language: "اللغة",
  },
  hero: {
    title: "نزّل أي فيديو من الإنترنت",
    subtitle: "الصق الرابط. اختر الجودة. نزّل.",
    placeholder: "https://example.com/watch?v=...",
    inputLabel: "رابط الفيديو",
    analyze: "تحليل الرابط",
    analyzing: "جارٍ التحليل...",
    paste: "لصق",
    clear: "مسح",
    supported: "المصادر المدعومة",
    supportedMore: "وغيرها الكثير",
  },
  result: {
    quality: "الجودة",
    format: "الصيغة",
    video: "فيديو",
    audio: "صوت",
    advanced: "خيارات متقدمة",
    advancedHint: "اختر تدفقًا محددًا. تحويل الصيغة قد يتطلب معالجة إضافية.",
    bestAvailable: "أفضل جودة متاحة",
    audioOnly: "صوت فقط",
    download: "تنزيل",
    starting: "جارٍ البدء...",
    duration: "المدة",
    channel: "القناة",
    views: "مشاهدة",
    size: "الحجم",
    approxSize: "حوالي",
    unknownSize: "الحجم غير معروف",
    presets: "خيارات سريعة",
    allowTranscode: "أعد الترميز إذا احتاجت الصيغة ذلك (أبطأ وقد يقلّل الجودة)",
    noVideoQualities: "هذا المصدر يوفّر الصوت فقط.",
    liveWarning: "لا يمكن تنزيل البث المباشر.",
  },
  playlist: {
    videos: "فيديو",
    selected: "محدد",
    selectAll: "تحديد الكل",
    unselectAll: "إلغاء التحديد",
    selectPage: "تحديد هذه الصفحة",
    downloadSelected: "تنزيل المحدد",
    creator: "المنشئ",
    unavailable: "غير متاح",
    page: "صفحة",
    of: "من",
    previous: "السابق",
    next: "التالي",
    truncated: "هذا المصدر يحتوي على عناصر أكثر مما نعرضه دفعة واحدة. عُرضت أول {count}.",
    limitNote: "يمكن إضافة حتى {max} فيديو في مهمة واحدة.",
  },
  progress: {
    queued: "في قائمة الانتظار",
    analyzing: "جارٍ قراءة المصدر",
    downloading: "جارٍ التنزيل",
    processing: "جارٍ تجهيز الملف",
    completed: "جاهز",
    failed: "فشل",
    cancelled: "أُلغي",
    expired: "انتهت صلاحيته",
    speed: "السرعة",
    eta: "الوقت المتبقي",
    cancel: "إلغاء",
    downloadFile: "تنزيل الملف",
    downloadAll: "تنزيل الكل كملف مضغوط",
    tryAgain: "حاول مرة أخرى",
    startOver: "ابدأ من جديد",
    videosDone: "{done} / {total} فيديو",
    expiresIn: "يُحذف هذا الملف بعد {time}.",
    keepOpen: "أبقِ هذه الصفحة مفتوحة أثناء التجهيز.",
  },
  history: {
    title: "التنزيلات الأخيرة",
    empty: "لا يوجد شيء بعد.",
    clear: "مسح السجل",
    localOnly: "محفوظ في هذا المتصفح فقط.",
  },
  manager: {
    title: "التنزيلات",
    open: "فتح التنزيلات",
    close: "إغلاق",
    transfers: "النقل",
    files: "الملفات",
    noTransfers: "لا توجد تنزيلات نشطة.",
    noFiles: "لا شيء جاهز بعد. تظهر هنا التنزيلات المكتملة.",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    cancel: "إلغاء",
    retry: "إعادة المحاولة",
    remove: "إزالة",
    clearFinished: "مسح المنتهية",
    clearAll: "مسح القائمة",
    selectAll: "تحديد الكل",
    selected: "{count} محدد",
    zipSelected: "تنزيل المحدد كملف مضغوط",
    zipAll: "تنزيل الكل كملف مضغوط",
    preparing: "جارٍ تجهيز الأرشيف...",
    connections: "{count} اتصالات",
    accelerated: "مُسرَّع",
    viaBrowser: "سُلّم إلى متصفحك",
    savedTo: "حُفظ",
    localOnly: "هذه القائمة محفوظة في هذا المتصفح فقط.",
    expires: "تنتهي صلاحيته {time}",
    files_one: "ملف واحد",
    files_many: "{count} ملفات",
    statusQueued: "في الانتظار",
    statusProbing: "جارٍ الاتصال",
    statusDownloading: "جارٍ التنزيل",
    statusPaused: "متوقف مؤقتًا",
    statusFinishing: "جارٍ الحفظ",
    statusDone: "تم",
    statusError: "فشل",
    statusCancelled: "أُلغي",
    acceleratedHint: "تُنزَّل الملفات الكبيرة عبر عدة اتصالات معًا وتُحفظ مباشرة على القرص.",
    browserHint: "هذا الملف يتولّاه متصفحك — راجع قائمة التنزيلات الخاصة به.",
  },
  errors: {
    generic: "حدث خطأ ما. حاول مرة أخرى.",
    network: "تعذّر الوصول إلى الخادم. تحقّق من اتصالك.",
    invalid_url: "هذا لا يبدو رابطًا صالحًا.",
    unsupported_scheme: "الروابط المدعومة هي http و https فقط.",
    blocked_host: "لا يمكن التنزيل من هذا العنوان.",
    blocked_address: "لا يمكن التنزيل من هذا العنوان.",
    blocked_port: "لا يمكن التنزيل من هذا العنوان.",
    dns_failure: "تعذّر الوصول إلى هذا الموقع.",
    invalid_selection: "اختر فيديو واحدًا على الأقل.",
    invalid_format: "هذه الجودة غير متاحة لهذا الفيديو.",
    unsupported_source: "هذا المصدر غير مدعوم حاليًا.",
    no_video_found: "لم نتمكن من استخراج فيديو قابل للتنزيل من هذا الرابط.",
    auth_required: "الفيديو موجود لكنه يتطلب حسابًا أو صلاحية لا نملكها.",
    geo_restricted: "هذا الفيديو غير متاح في منطقة الخادم.",
    protected_content: "هذا الفيديو محمي ولا يمكن تنزيله.",
    content_unavailable: "هذا الفيديو خاص أو محذوف أو غير متاح.",
    live_not_supported: "لا يمكن تنزيل البث المباشر.",
    extraction_failed: "تعذّرت قراءة هذا الرابط.",
    extraction_timeout: "استغرق المصدر وقتًا طويلاً للرد.",
    file_too_large: "حجم هذا الملف أكبر من الحد المسموح.",
    duration_too_long: "مدة هذا الفيديو أطول مما يمكننا معالجته.",
    playlist_too_large: "قائمة التشغيل تحتوي على فيديوهات أكثر مما يمكن قبوله دفعة واحدة.",
    rate_limited: "طلبات كثيرة جدًا. انتظر قليلاً.",
    too_many_active_jobs: "لديك تنزيلات قيد التشغيل. انتظر حتى تنتهي.",
    queue_full: "الخدمة مزدحمة حاليًا. حاول بعد قليل.",
    download_failed: "حدث خطأ أثناء التنزيل.",
    processing_failed: "حدث خطأ أثناء تجهيز الملف.",
    ffmpeg_missing: "معالجة الوسائط غير متاحة حاليًا.",
    storage_failed: "تعذّر حفظ الملف النهائي.",
    job_not_found: "لم يتم العثور على هذا التنزيل.",
    job_not_ready: "هذا التنزيل غير جاهز بعد.",
    job_cancelled: "تم إلغاء هذا التنزيل.",
    job_expired: "انتهت صلاحية هذا التنزيل وتم حذفه.",
    file_missing: "الملف لم يعد متاحًا.",
    forbidden: "غير مسموح.",
    internal_error: "حدث خطأ غير متوقع.",
  },
  footer: {
    disclaimer: "نزّل فقط المحتوى الذي تملك حق تنزيله.",
    privacy: "الخصوصية",
    terms: "الشروط",
    copyright: "حقوق النشر / DMCA",
    builtWith: "الاستخراج مدعوم بواسطة yt-dlp.",
  },
  seo: {
    youtube: {
      title: "تنزيل فيديوهات يوتيوب",
      heading: "نزّل فيديوهات يوتيوب",
      body: "الصق أي رابط يوتيوب لترى الدقات التي يوفّرها الفيديو فعلاً، من 144p حتى 4K و8K عند توفّرها، مع خيارات الصوت فقط.",
    },
    playlist: {
      title: "تنزيل قوائم وقنوات يوتيوب",
      heading: "نزّل قائمة تشغيل أو قناة كاملة",
      body: "الصق رابط القائمة أو القناة، اختر الفيديوهات التي تريدها، حدّد جودة واحدة للجميع، واحصل عليها في ملف واحد.",
    },
    tiktok: {
      title: "تنزيل فيديوهات تيك توك",
      heading: "نزّل فيديوهات تيك توك",
      body: "الصق رابط تيك توك للحصول على ملف الفيديو بالجودة التي نشرتها المنصة.",
    },
    instagram: {
      title: "تنزيل فيديوهات وريلز إنستغرام",
      heading: "نزّل فيديوهات وريلز إنستغرام",
      body: "يعمل مع الريلز العامة والمنشورات التي تحتوي فيديو والروابط المباشرة.",
    },
    twitter: {
      title: "تنزيل فيديوهات إكس (تويتر)",
      heading: "نزّل الفيديوهات من إكس",
      body: "الصق رابط منشور عام يحتوي على فيديو واختر الجودة.",
    },
    tryIt: "جرّبه بالأسفل",
  },
};

const dictionaries: Record<Locale, typeof en> = { en, ar };

export type Dict = typeof en;

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Look up a backend error code, falling back to a generic message. */
export function errorMessage(dict: Dict, code: string | null | undefined): string {
  if (!code) return dict.errors.generic;
  const table = dict.errors as Record<string, string>;
  return table[code] ?? dict.errors.generic;
}

/** Minimal ``{placeholder}`` interpolation - no template engine needed. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
