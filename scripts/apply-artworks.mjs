import fs from 'fs';
import path from 'path';

const TRACKS_DIR = 'H:/tawwerni/public/images/tracks';
const LESSONS_DIR = 'H:/tawwerni/public/images/lessons';

if (!fs.existsSync(LESSONS_DIR)) {
  fs.mkdirSync(LESSONS_DIR, { recursive: true });
}

// 96 verified mappings from Gemini generated files to course slugs
const GEMINI_MAPPINGS = [
  // Stage 1
  { src: 'Gemini_Generated_Image_qpwiwhqpwiwhqpwi.jpg', slug: 'ai-media-midjourney' },
  { src: 'Gemini_Generated_Image_k7t842k7t842k7t8.jpg', slug: 'ai-video-creation' },
  { src: 'Gemini_Generated_Image_hu8eathu8eathu8e.jpg', slug: 'ai-workplace-productivity' },
  { src: 'Gemini_Generated_Image_2h3pzp2h3pzp2h3p.jpg', slug: 'no-code-ai-apps' },
  { src: 'Gemini_Generated_Image_eqn6nieqn6nieqn6.jpg', slug: 'local-llms-open-source' },
  { src: 'Gemini_Generated_Image_qdwmpoqdwmpoqdwm.jpg', slug: 'ai-chatbots-business' },
  { src: 'Gemini_Generated_Image_60bm7460bm7460bm.jpg', slug: 'ai-copywriting-scripts' },
  { src: 'Gemini_Generated_Image_o4wj3lo4wj3lo4wj.jpg', slug: 'ai-ethics-governance' },

  // Stage 2
  { src: 'Gemini_Generated_Image_xwn16yxwn16yxwn1.jpg', slug: 'modern-coding-fundamentals' },
  { src: 'Gemini_Generated_Image_fv2voefv2voefv2v.jpg', slug: 'frontend-react-nextjs' },
  { src: 'Gemini_Generated_Image_u2j2cxu2j2cxu2j2.jpg', slug: 'backend-nodejs-prisma' },
  { src: 'Gemini_Generated_Image_xu9nexu9nexu9nex.jpg', slug: 'python-automation-scripting' },
  { src: 'Gemini_Generated_Image_ynm92rynm92rynm9.jpg', slug: 'mobile-apps-flutter' },
  { src: 'Gemini_Generated_Image_kqt3zzkqt3zzkqt3.jpg', slug: 'api-architecture-design' },
  { src: 'Gemini_Generated_Image_f16jqaf16jqaf16j.jpg', slug: 'cloud-devops-docker' },
  { src: 'Gemini_Generated_Image_7fb3lx7fb3lx7fb3.jpg', slug: 'secure-web-development' },
  { src: 'Gemini_Generated_Image_8tn5xi8tn5xi8tn5.jpg', slug: 'nocode-web-framer' },
  { src: 'Gemini_Generated_Image_90lcbv90lcbv90lc.jpg', slug: 'custom-ecommerce-dev' },

  // Stage 3
  { src: 'Gemini_Generated_Image_8agusr8agusr8agu.jpg', slug: 'advanced-excel-powerquery' },
  { src: 'Gemini_Generated_Image_gyh4hngyh4hngyh4.jpg', slug: 'sql-data-analytics' },
  { src: 'Gemini_Generated_Image_gov9ykgov9ykgov9.jpg', slug: 'python-data-science' },
  { src: 'Gemini_Generated_Image_hyyoi6hyyoi6hyyo.jpg', slug: 'applied-business-statistics' },
  { src: 'Gemini_Generated_Image_rxjtkmrxjtkmrxjt.jpg', slug: 'predictive-analytics-forecasting' },
  { src: 'Gemini_Generated_Image_3kecbc3kecbc3kec.jpg', slug: 'data-wrangling-pipelines' },
  { src: 'Gemini_Generated_Image_7x498v7x498v7x49.jpg', slug: 'kpi-dashboards-finance' },
  { src: 'Gemini_Generated_Image_ndzrt6ndzrt6ndzr.jpg', slug: 'automated-reporting-analytics' },
  { src: 'Gemini_Generated_Image_izmxdrizmxdrizmx.jpg', slug: 'data-driven-decision-making' },

  // Stage 4
  { src: 'Gemini_Generated_Image_qs7zkmqs7zkmqs7z.jpg', slug: 'zero-to-first-dollar-freelancer' },
  { src: 'Gemini_Generated_Image_r5rui5r5rui5r5ru.jpg', slug: 'upwork-fiverr-global-mastery' },
  { src: 'Gemini_Generated_Image_f5ebvnf5ebvnf5eb.jpg', slug: 'winning-proposals-cold-emailing' },
  { src: 'Gemini_Generated_Image_vcjx3vcjx3vcjx3v.jpg', slug: 'high-ticket-pricing-packaging' },
  { src: 'Gemini_Generated_Image_6p60v56p60v56p60.jpg', slug: 'client-management-retention' },
  { src: 'Gemini_Generated_Image_4rl62w4rl62w4rl6.jpg', slug: 'portfolio-building-case-studies' },
  { src: 'Gemini_Generated_Image_xgwlsvxgwlsvxgwl.jpg', slug: 'freelancer-finances-cashflow' },
  { src: 'Gemini_Generated_Image_tizoq9tizoq9tizo.jpg', slug: 'freelancer-to-agency-scaling' },
  { src: 'Gemini_Generated_Image_b85llqb85llqb85l.jpg', slug: 'global-invoicing-international-clients' },
  { src: 'Gemini_Generated_Image_btxgmgbtxgmgbtxg.jpg', slug: 'freelance-burnout-prevention' },

  // Stage 5
  { src: 'Gemini_Generated_Image_f0rsyqf0rsyqf0rs.jpg', slug: 'integrated-digital-marketing-strategy' },
  { src: 'Gemini_Generated_Image_h1np1qh1np1qh1np.jpg', slug: 'meta-ads-mastery' },
  { src: 'Gemini_Generated_Image_t8nzrmt8nzrmt8nz.jpg', slug: 'google-ads-performance-max' },
  { src: 'Gemini_Generated_Image_v6wfm4v6wfm4v6wf.jpg', slug: 'tiktok-ads-viral-marketing' },
  { src: 'Gemini_Generated_Image_xafn7exafn7exafn.jpg', slug: 'modern-seo-semantic-search' },
  { src: 'Gemini_Generated_Image_qpcw74qpcw74qpcw.jpg', slug: 'high-converting-copywriting' },
  { src: 'Gemini_Generated_Image_ub6sl9ub6sl9ub6s.jpg', slug: 'sales-funnels-cro' },
  { src: 'Gemini_Generated_Image_4ahfeq4ahfeq4ahf.jpg', slug: 'email-marketing-automation' },
  { src: 'Gemini_Generated_Image_e5o0mre5o0mre5o0.jpg', slug: 'inbound-organic-content' },
  { src: 'Gemini_Generated_Image_ky1rxoky1rxoky1r.jpg', slug: 'personal-branding-linkedin-x' },

  // Stage 6
  { src: 'Gemini_Generated_Image_x88btzx88btzx88b.jpg', slug: 'ui-ux-design-figma' },
  { src: 'Gemini_Generated_Image_o2retuo2retuo2re.jpg', slug: 'user-research-wireframing' },
  { src: 'Gemini_Generated_Image_cnvczncnvczncnvc.jpg', slug: 'scalable-design-systems' },
  { src: 'Gemini_Generated_Image_2ba0c62ba0c62ba0.jpg', slug: 'brand-identity-visual-storytelling' },
  { src: 'Gemini_Generated_Image_6zl0rb6zl0rb6zl0.jpg', slug: 'short-form-video-editing' },
  { src: 'Gemini_Generated_Image_4ckd6a4ckd6a4ckd.jpg', slug: '3d-design-blender-basics' },
  { src: 'Gemini_Generated_Image_vlrm5bvlrm5bvlrm.jpg', slug: 'thumbnail-ad-creative-design' },
  { src: 'Gemini_Generated_Image_16det416det416de.jpg', slug: 'audio-podcasting-sound-design' },
  { src: 'Gemini_Generated_Image_km8qhokm8qhokm8q.jpg', slug: 'creative-direction-pitching' },

  // Stage 7
  { src: 'Gemini_Generated_Image_saqb0gsaqb0gsaqb.jpg', slug: 'idea-validation-product-market-fit' },
  { src: 'Gemini_Generated_Image_ka9053ka9053ka90.jpg', slug: 'business-model-canvas-monetization' },
  { src: 'Gemini_Generated_Image_6ojy1k6ojy1k6ojy.jpg', slug: 'building-launching-mvp' },
  { src: 'Gemini_Generated_Image_t3i6z1t3i6z1t3i6.jpg', slug: 'zero-budget-traction-growth' },
  { src: 'Gemini_Generated_Image_i4ecnoi4ecnoi4ec.jpg', slug: 'b2b-sales-pipeline-crm' },
  { src: 'Gemini_Generated_Image_ej11y2ej11y2ej11.jpg', slug: 'pitch-decks-fundraising-basics' },
  { src: 'Gemini_Generated_Image_u39shtu39shtu39s.jpg', slug: 'unit-economics-startup-finance' },
  { src: 'Gemini_Generated_Image_kbpl20kbpl20kbpl.jpg', slug: 'remote-team-hiring-leadership' },
  { src: 'Gemini_Generated_Image_m4scj3m4scj3m4sc.jpg', slug: 'ecommerce-store-supply-chain' },
  { src: 'Gemini_Generated_Image_4hzv84hzv84hzv84.jpg', slug: 'crisis-management-business-resilience' },

  // Stage 8
  { src: 'Gemini_Generated_Image_8rjkwx8rjkwx8rjk.jpg', slug: 'personal-cyber-hygiene-opsec' },
  { src: 'Gemini_Generated_Image_jnwo7cjnwo7cjnwo.jpg', slug: 'computer-networking-fundamentals' },
  { src: 'Gemini_Generated_Image_7asrb67asrb67asr.jpg', slug: 'ethical-hacking-penetration-testing' },
  { src: 'Gemini_Generated_Image_jh47yyjh47yyjh47.jpg', slug: 'cloud-security-essentials' },
  { src: 'Gemini_Generated_Image_fg252fg252fg252f.jpg', slug: 'threat-detection-incident-response' },
  { src: 'Gemini_Generated_Image_mp6ly2mp6ly2mp6l.jpg', slug: 'endpoint-enterprise-security' },
  { src: 'Gemini_Generated_Image_m44tgam44tgam44t.jpg', slug: 'social-engineering-antiphishing' },
  { src: 'Gemini_Generated_Image_swwe9fswwe9fswwe.jpg', slug: 'data-privacy-gdpr-compliance' },
  { src: 'Gemini_Generated_Image_puovelpuovelpuov.jpg', slug: 'identity-access-management-iam' },
  { src: 'Gemini_Generated_Image_7v1xro7v1xro7v1x.jpg', slug: 'applied-cryptography-secure-comms' },

  // Stage 9
  { src: 'Gemini_Generated_Image_k10vnbk10vnbk10v.jpg', slug: 'art-of-persuasion-influence' },
  { src: 'Gemini_Generated_Image_9b6dcf9b6dcf9b6d.jpg', slug: 'public-speaking-presentations' },
  { src: 'Gemini_Generated_Image_qz4kkwqz4kkwqz4k.jpg', slug: 'emotional-intelligence-workplace' },
  { src: 'Gemini_Generated_Image_istzy0istzy0istz.jpg', slug: 'high-stakes-salary-negotiation' },
  { src: 'Gemini_Generated_Image_ajdbsajdbsajdbsa.jpg', slug: 'critical-thinking-structured-problem-solving' },
  { src: 'Gemini_Generated_Image_97ztbc97ztbc97zt.jpg', slug: 'assertive-communication-conflict-resolution' },
  { src: 'Gemini_Generated_Image_56ozpp56ozpp56oz.jpg', slug: 'business-storytelling-leaders' },
  { src: 'Gemini_Generated_Image_5fte4t5fte4t5fte.jpg', slug: 'career-transitions-adaptability' },
  { src: 'Gemini_Generated_Image_act83gact83gact8.jpg', slug: 'mentorship-coaching-culture' },
  { src: 'Gemini_Generated_Image_mctcwqmctcwqmctc.jpg', slug: 'strategic-networking-relationships' },

  // Stage 10
  { src: 'Gemini_Generated_Image_fgb692fgb692fgb6.jpg', slug: 'atomic-habits-relentless-focus' },
  { src: 'Gemini_Generated_Image_sb1kdksb1kdksb1k.jpg', slug: 'deep-work-flow-state-mastery' },
  { src: 'Gemini_Generated_Image_4gir1u4gir1u4gir.jpg', slug: 'time-blocking-prioritization-eisenhower' },
  { src: 'Gemini_Generated_Image_uuapf7uuapf7uuap.jpg', slug: 'curing-procrastination-biases' },
  { src: 'Gemini_Generated_Image_g1595cg1595cg159.jpg', slug: 'energy-management-sleep-architecture' },
  { src: 'Gemini_Generated_Image_81p3uv81p3uv81p3.jpg', slug: 'overcoming-imposter-syndrome' },
  { src: 'Gemini_Generated_Image_uwdvuruwdvuruwdv.jpg', slug: 'digital-minimalism-attention-protection' },
  { src: 'Gemini_Generated_Image_tzl417tzl417tzl4.jpg', slug: 'growth-mindset-psychological-grit' },
  { src: 'Gemini_Generated_Image_y2vxbey2vxbey2vx.jpg', slug: 'decision-making-under-stress' },
  { src: 'Gemini_Generated_Image_ejjulkejjulkejju.jpg', slug: 'life-architecture-sustainable-harmony' },
];

// Pre-existing flagship tracks
const FLAGSHIP_TRACKS = [
  'prompt-engineering-mastery',
  'autonomous-ai-agents',
  'powerbi-tableau-visualization',
  'motion-graphics-after-effects'
];

console.log(`Starting artwork application for ${GEMINI_MAPPINGS.length} generated artworks...`);

// Check uniqueness of sources and slugs
const seenSrc = new Set();
const seenSlugs = new Set();

for (const m of GEMINI_MAPPINGS) {
  if (seenSrc.has(m.src)) {
    throw new Error(`Duplicate source image: ${m.src}`);
  }
  seenSrc.add(m.src);

  if (seenSlugs.has(m.slug)) {
    throw new Error(`Duplicate slug in mappings: ${m.slug}`);
  }
  seenSlugs.add(m.slug);
}

for (const f of FLAGSHIP_TRACKS) {
  if (seenSlugs.has(f)) {
    throw new Error(`Flagship ${f} overlaps with generated mappings`);
  }
  seenSlugs.add(f);
}

console.log(`Total unique tracks covered: ${seenSlugs.size} (Must be exactly 100)`);
if (seenSlugs.size !== 100) {
  throw new Error(`Expected 100 unique tracks, but got ${seenSlugs.size}`);
}

let copiedCount = 0;
for (const item of GEMINI_MAPPINGS) {
  const sourcePath = path.join(TRACKS_DIR, item.src);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source file does not exist: ${sourcePath}`);
  }

  const targetTrackPath = path.join(TRACKS_DIR, `${item.slug}.jpg`);
  const targetLessonPath = path.join(LESSONS_DIR, `${item.slug}.jpg`);

  fs.copyFileSync(sourcePath, targetTrackPath);
  fs.copyFileSync(sourcePath, targetLessonPath);
  copiedCount++;
}

// Also ensure flagship tracks are copied to lessons dir if present in tracks dir
for (const f of FLAGSHIP_TRACKS) {
  const trackSrc = path.join(TRACKS_DIR, `${f}.jpg`);
  const lessonDst = path.join(LESSONS_DIR, `${f}.jpg`);
  if (fs.existsSync(trackSrc)) {
    fs.copyFileSync(trackSrc, lessonDst);
  }
}

console.log(`Successfully copied ${copiedCount} generated files to public/images/tracks and public/images/lessons!`);

// Verify all 100 files exist in tracks and lessons
let all100Exist = true;
for (const slug of seenSlugs) {
  const trackPath = path.join(TRACKS_DIR, `${slug}.jpg`);
  const lessonPath = path.join(LESSONS_DIR, `${slug}.jpg`);
  if (!fs.existsSync(trackPath)) {
    console.error(`Missing track image: ${trackPath}`);
    all100Exist = false;
  }
  if (!fs.existsSync(lessonPath)) {
    console.error(`Missing lesson image: ${lessonPath}`);
    all100Exist = false;
  }
}

if (all100Exist) {
  console.log(`ALL 100 TRACK ARTWORKS VERIFIED 100% IN BOTH TRACKS AND LESSONS FOLDERS!`);
} else {
  throw new Error(`Some artworks were missing!`);
}
