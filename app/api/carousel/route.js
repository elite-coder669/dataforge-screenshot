export const runtime = 'edge';

// ─────────────────────────────────────────
// BRAND
// ─────────────────────────────────────────
const BRAND = {
  accent:    '#ff3366',
  accentAlt: '#ff6b35',
  pink:      '#e91e8c',
  orange:    '#f5a623',
  purple:    '#7c3aed',
  blue:      '#3b82f6',
  // dark theme
  dark: {
    bg:      '#0a0a0a',
    surface: '#111111',
    border:  '#1e1e1e',
    text:    '#ffffff',
    muted:   '#888888',
  },
  // light theme
  light: {
    bg:      '#f9f9f7',
    surface: '#ffffff',
    border:  '#e5e5e5',
    text:    '#0a0a0a',
    muted:   '#666666',
  },
};

// ─────────────────────────────────────────
// LAYOUTS
// 6 structurally distinct layouts
// ─────────────────────────────────────────
const LAYOUTS = [
  'hero',        // big centered title, minimal decoration
  'split',       // left accent bar + content right
  'stat',        // giant number/stat dominates
  'timeline',    // numbered steps flow vertically
  'quote',       // pull-quote style, large italic text
  'grid',        // 2×2 or 2×3 card grid
];

// ─────────────────────────────────────────
// HOOKS — strong predefined openers
// (swap body to LLM call later)
// ─────────────────────────────────────────
const HOOKS = {
  problem: [
    { title: "Your model is lying to you.",           subtitle: "And it's not your fault — it's your data." },
    { title: "52% accuracy isn't a model problem.",   subtitle: "It's a data problem. Here's proof." },
    { title: "Stop blaming your architecture.",       subtitle: "Your training data is broken." },
    { title: "You're debugging the wrong layer.",     subtitle: "The bug lives in your dataset." },
    { title: "Bad data ships fast.",                  subtitle: "Good models don't survive it." },
    { title: "Your model learned your mistakes.",     subtitle: "Every single one of them." },
  ],
  visual: [
    { title: "See your data before you trust it.",    subtitle: "Visualize issues in seconds." },
    { title: "What your dataset hides.",              subtitle: "Revealed in one upload." },
    { title: "Garbage in. Garbage out.",              subtitle: "Now you can see exactly where." },
  ],
  speed: [
    { title: "2 seconds.",                            subtitle: "That's how long a quality check should take." },
    { title: "You don't need Python for this.",       subtitle: "No setup. No environment. Just drop your CSV." },
    { title: "DataForge runs in your browser.",       subtitle: "Your data never leaves your machine." },
  ],
  cta: [
    { title: "Try it free. Right now.",               subtitle: "thedataforge.in — no signup required." },
    { title: "Your next model deserves clean data.",  subtitle: "Start at thedataforge.in" },
    { title: "One upload. Full data audit.",          subtitle: "Free. Private. Fast." },
  ],
};

function pickHook(type = 'problem') {
  const pool = HOOKS[type] ?? HOOKS.problem;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─────────────────────────────────────────
// TEMPLATE PICKER
// Pick layout + theme randomly, return config
// ─────────────────────────────────────────
function pickTemplate() {
  const layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
  const theme  = Math.random() > 0.35 ? 'dark' : 'light'; // 65% dark, 35% light
  return { layout, theme };
}

// ─────────────────────────────────────────
// SLIDE BUILDERS
// Each returns a slide object compatible with screenshot API
// ─────────────────────────────────────────

function buildSlides({ caption, topic, points, layout, theme }) {
  const hook = pickHook('problem');
  const ctaHook = pickHook('cta');

  const defaultPoints = points?.length > 0 ? points : [
    'Class imbalance detected before you queue a job',
    'Feature-target leakage — correlation above 0.8 flagged',
    'Duplicates, outliers, nulls — ranked by training impact',
  ];

  // Slide 1 — always hook/opener
  const slide1 = {
    slide: 1, total: 5, isFirst: true, isLast: false,
    layout,   // hero / split / stat / timeline / quote / grid
    theme,
    tag:    'DATA QUALITY',
    title:  hook.title,
    subtitle: hook.subtitle,
    body:   [],
    stat:   null,
    steps:  [],
  };

  // Slide 2 — problem framing
  const slide2 = {
    slide: 2, total: 5, isFirst: false, isLast: false,
    layout, theme,
    tag:   null,
    title: 'The Real Problem',
    subtitle: 'Every failed model has the same root cause.',
    body:  defaultPoints.slice(0, 3),
    stat:  null,
    steps: defaultPoints.slice(0, 3).map((p, i) => ({ step: i + 1, text: p })),
  };

  // Slide 3 — what DataForge catches
  const slide3 = {
    slide: 3, total: 5, isFirst: false, isLast: false,
    layout, theme,
    tag:   'AUDIT ENGINE',
    title: 'What DataForge catches',
    subtitle: null,
    body:  [
      'Class imbalance — before you queue a training job',
      'Feature-target leakage — correlation > 0.8',
      'Duplicates, outliers, missing values — ranked by severity',
    ],
    stat:  null,
    steps: [
      { step: 1, text: 'Upload your CSV or dataset' },
      { step: 2, text: 'Audit runs in under 2 seconds' },
      { step: 3, text: 'Get a quality score 0–100 + ranked issues' },
    ],
  };

  // Slide 4 — stat/speed slide
  const slide4 = {
    slide: 4, total: 5, isFirst: false, isLast: false,
    layout, theme,
    tag:   null,
    title: '2 seconds.',
    subtitle: 'Drop your CSV. Get a quality score, ranked issues, and exact training impact. No Python. No setup. Runs in your browser.',
    body:  [],
    stat:  { value: '2s', label: 'Full data audit. No setup.' },
    steps: [],
  };

  // Slide 5 — CTA
  const slide5 = {
    slide: 5, total: 5, isFirst: false, isLast: true,
    layout, theme,
    tag:   'OPEN BETA',
    title: ctaHook.title,
    subtitle: ctaHook.subtitle,
    body:  [],
    stat:  null,
    steps: [],
    cta:   'thedataforge.in',
  };

  return [slide1, slide2, slide3, slide4, slide5];
}

// ─────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────
export async function POST(req) {
  try {
    const { caption, topic, points } = await req.json();

    if (!caption && !topic) {
      return Response.json({ error: 'caption or topic is required' }, { status: 400 });
    }

    const { layout, theme } = pickTemplate();

    const slides = buildSlides({
      caption: caption || topic,
      topic:   topic || '',
      points:  points || [],
      layout,
      theme,
    });

    return Response.json({
      slides,
      total:    slides.length,
      layout,
      theme,
      brand:    'dataforge',
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}