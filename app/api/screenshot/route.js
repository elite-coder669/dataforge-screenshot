import satori from 'satori';
import sharp from 'sharp';

export const runtime = 'nodejs';

// ─────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────
const BRAND = {
  accent:    '#ff3366',
  accentAlt: '#ff6b35',
  pink:      '#e91e8c',
  orange:    '#f5a623',
  purple:    '#7c3aed',
  blue:      '#3b82f6',
  dark: {
    bg:      '#0a0a0a',
    surface: '#111111',
    border:  '#1e1e1e',
    text:    '#ffffff',
    muted:   '#888888',
  },
  light: {
    bg:      '#f9f9f7',
    surface: '#ffffff',
    border:  '#e5e5e5',
    text:    '#0a0a0a',
    muted:   '#666666',
  },
};

const W = 1080;
const H = 1080;

// ─────────────────────────────────────────
// SHARED COMPONENTS (as node factories)
// ─────────────────────────────────────────

function Logo({ colors }) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', alignItems: 'center', gap: '12px' },
      children: [
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexWrap: 'wrap', width: '28px', gap: '3px' },
            children: [
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.pink } } },
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.orange } } },
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.purple } } },
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.blue } } },
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { color: colors.muted, fontSize: '15px', letterSpacing: '4px', fontWeight: 'bold' },
            children: 'DATAFORGE',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              marginLeft: '6px',
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              color: colors.muted,
              fontSize: '10px',
              padding: '2px 7px',
              borderRadius: '3px',
              letterSpacing: '2px',
            },
            children: 'BETA',
          },
        },
      ],
    },
  };
}

function Tag({ text, colors }) {
  if (!text) return null;
  return {
    type: 'div',
    props: {
      style: {
        background: `${BRAND.accent}22`,
        border: `1px solid ${BRAND.accent}55`,
        color: BRAND.accent,
        fontSize: '12px',
        padding: '5px 14px',
        borderRadius: '3px',
        letterSpacing: '2px',
        fontWeight: 'bold',
        alignSelf: 'flex-start',
      },
      children: text,
    },
  };
}

function Dots({ total, current, colors }) {
  return {
    type: 'div',
    props: {
      style: { display: 'flex', gap: '8px', alignItems: 'center' },
      children: Array.from({ length: total }, (_, i) => ({
        type: 'div',
        props: {
          style: {
            width:        i === current ? '24px' : '8px',
            height:       '8px',
            borderRadius: '4px',
            background:   i === current ? BRAND.accent : colors.border,
          },
        },
      })),
    },
  };
}

// Grid bg overlay (dark only)
function GridBg({ colors, opacity = 0.3 }) {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        opacity,
      },
    },
  };
}

// Accent glow blob
function Glow({ top = '-200px', left = '-200px', color = BRAND.accent }) {
  return {
    type: 'div',
    props: {
      style: {
        position: 'absolute',
        top, left,
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}1a 0%, transparent 70%)`,
      },
    },
  };
}

// ─────────────────────────────────────────
// LAYOUT RENDERERS
// Each returns a satori node tree
// ─────────────────────────────────────────

// 1. HERO — centered, big title, minimal chrome
function renderHero({ slide, colors }) {
  const { title, subtitle, tag, body, slide: idx, total, isLast, cta } = slide;
  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`, height: `${H}px`,
        background: colors.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '80px',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      },
      children: [
        GridBg({ colors }),
        Glow({ top: '-150px', left: '50%' }),
        // Logo top-center
        {
          type: 'div',
          props: {
            style: { position: 'absolute', top: '60px', left: '50%', display: 'flex', justifyContent: 'center' },
            children: Logo({ colors }),
          },
        },
        // Accent line
        {
          type: 'div',
          props: {
            style: { width: '60px', height: '4px', background: BRAND.accent, borderRadius: '2px', marginBottom: '32px', zIndex: 1 },
          },
        },
        Tag({ text: tag, colors }),
        tag ? { type: 'div', props: { style: { height: '20px' } } } : null,
        {
          type: 'div',
          props: {
            style: { color: colors.text, fontSize: '68px', fontWeight: 'bold', lineHeight: 1.1, zIndex: 1, maxWidth: '900px' },
            children: title,
          },
        },
        subtitle ? {
          type: 'div',
          props: {
            style: { color: colors.muted, fontSize: '26px', lineHeight: 1.5, marginTop: '28px', zIndex: 1, maxWidth: '720px' },
            children: subtitle,
          },
        } : null,
        cta ? {
          type: 'div',
          props: {
            style: { color: BRAND.accent, fontSize: '22px', marginTop: '40px', zIndex: 1, letterSpacing: '1px' },
            children: cta + ' →',
          },
        } : null,
        // Footer dots
        {
          type: 'div',
          props: {
            style: { position: 'absolute', bottom: '60px', left: '50%', display: 'flex', justifyContent: 'center' },
            children: Dots({ total, current: idx - 1, colors }),
          },
        },
      ].filter(Boolean),
    },
  };
}

// 2. SPLIT — thick accent bar left, content right
function renderSplit({ slide, colors }) {
  const { title, subtitle, tag, body, slide: idx, total, isLast, cta } = slide;
  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`, height: `${H}px`,
        background: colors.bg,
        display: 'flex',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        // Left accent column
        {
          type: 'div',
          props: {
            style: {
              width: '12px',
              background: `linear-gradient(180deg, ${BRAND.accent}, ${BRAND.accentAlt})`,
              flexShrink: 0,
            },
          },
        },
        // Right content
        {
          type: 'div',
          props: {
            style: {
              flex: 1, display: 'flex', flexDirection: 'column',
              padding: '80px 80px 60px 72px',
              position: 'relative',
            },
            children: [
              GridBg({ colors, opacity: 0.2 }),
              Logo({ colors }),
              { type: 'div', props: { style: { height: '60px' } } },
              Tag({ text: tag, colors }),
              tag ? { type: 'div', props: { style: { height: '20px' } } } : null,
              {
                type: 'div',
                props: {
                  style: { color: colors.text, fontSize: '60px', fontWeight: 'bold', lineHeight: 1.1, zIndex: 1, maxWidth: '840px' },
                  children: title,
                },
              },
              subtitle ? {
                type: 'div',
                props: {
                  style: { color: colors.muted, fontSize: '24px', lineHeight: 1.5, marginTop: '24px', zIndex: 1, maxWidth: '800px' },
                  children: subtitle,
                },
              } : null,
              body?.length > 0 ? {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '40px', zIndex: 1 },
                  children: body.map((item, i) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex', gap: '16px', alignItems: 'flex-start',
                        background: colors.surface, border: `1px solid ${colors.border}`,
                        padding: '18px 22px', borderRadius: '6px',
                      },
                      children: [
                        { type: 'div', props: { style: { color: BRAND.accent, fontSize: '16px', fontWeight: 'bold', minWidth: '28px' }, children: `0${i + 1}` } },
                        { type: 'div', props: { style: { color: colors.text, fontSize: '19px', lineHeight: 1.4 }, children: item } },
                      ],
                    },
                  })),
                },
              } : null,
              {
                type: 'div',
                props: {
                  style: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '40px', zIndex: 1 },
                  children: [
                    Dots({ total, current: idx - 1, colors }),
                    isLast
                      ? { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px' }, children: 'thedataforge.in →' } }
                      : { type: 'div', props: { style: { color: colors.muted, fontSize: '14px' }, children: `${idx} / ${total}` } },
                  ],
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  };
}

// 3. STAT — giant number dominates center
function renderStat({ slide, colors }) {
  const { title, subtitle, stat, tag, slide: idx, total, isLast } = slide;
  const statVal   = stat?.value   || '2s';
  const statLabel = stat?.label   || subtitle || '';
  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`, height: `${H}px`,
        background: colors.bg,
        display: 'flex', flexDirection: 'column',
        padding: '80px',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        GridBg({ colors }),
        Glow({ top: '200px', left: '200px', color: BRAND.blue }),
        Logo({ colors }),
        Tag({ text: tag, colors }),
        // Huge stat
        {
          type: 'div',
          props: {
            style: {
              color: BRAND.accent,
              fontSize: '220px',
              fontWeight: 'bold',
              lineHeight: 1,
              marginTop: '60px',
              zIndex: 1,
              letterSpacing: '-8px',
            },
            children: statVal,
          },
        },
        {
          type: 'div',
          props: {
            style: { color: colors.text, fontSize: '36px', fontWeight: 'bold', zIndex: 1, marginTop: '16px', maxWidth: '700px' },
            children: title,
          },
        },
        statLabel ? {
          type: 'div',
          props: {
            style: { color: colors.muted, fontSize: '22px', zIndex: 1, marginTop: '16px', maxWidth: '700px', lineHeight: 1.5 },
            children: statLabel,
          },
        } : null,
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto', zIndex: 1 },
            children: [
              Dots({ total, current: idx - 1, colors }),
              isLast
                ? { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px' }, children: 'thedataforge.in →' } }
                : { type: 'div', props: { style: { color: colors.muted, fontSize: '14px' }, children: `${idx} / ${total}` } },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

// 4. TIMELINE — numbered steps flow vertically
function renderTimeline({ slide, colors }) {
  const { title, tag, steps, slide: idx, total, isLast } = slide;
  const items = steps?.length > 0 ? steps : [];
  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`, height: `${H}px`,
        background: colors.bg,
        display: 'flex', flexDirection: 'column',
        padding: '80px',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        GridBg({ colors }),
        Logo({ colors }),
        { type: 'div', props: { style: { height: '40px' } } },
        Tag({ text: tag, colors }),
        { type: 'div', props: { style: { height: '20px' } } },
        {
          type: 'div',
          props: {
            style: { color: colors.text, fontSize: '52px', fontWeight: 'bold', lineHeight: 1.1, zIndex: 1, marginBottom: '48px' },
            children: title,
          },
        },
        // Steps
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: '0px', zIndex: 1, flex: 1 },
            children: items.map((item, i) => ({
              type: 'div',
              props: {
                style: { display: 'flex', gap: '28px', alignItems: 'flex-start' },
                children: [
                  // Step circle + line
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' },
                      children: [
                        {
                          type: 'div',
                          props: {
                            style: {
                              width: '44px', height: '44px', borderRadius: '50%',
                              background: BRAND.accent,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: '16px', fontWeight: 'bold',
                              flexShrink: 0,
                            },
                            children: String(item.step),
                          },
                        },
                        i < items.length - 1 ? {
                          type: 'div',
                          props: { style: { width: '2px', flex: 1, background: colors.border, minHeight: '40px' } },
                        } : null,
                      ].filter(Boolean),
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { color: colors.text, fontSize: '22px', lineHeight: 1.4, paddingTop: '10px', paddingBottom: '40px' },
                      children: item.text,
                    },
                  },
                ],
              },
            })),
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', paddingTop: '20px', zIndex: 1 },
            children: [
              Dots({ total, current: idx - 1, colors }),
              isLast
                ? { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px' }, children: 'thedataforge.in →' } }
                : { type: 'div', props: { style: { color: colors.muted, fontSize: '14px' }, children: `${idx} / ${total}` } },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

// 5. QUOTE — large pull-quote style, accent marks
function renderQuote({ slide, colors }) {
  const { title, subtitle, tag, slide: idx, total, isLast, cta } = slide;
  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`, height: `${H}px`,
        background: colors.bg,
        display: 'flex', flexDirection: 'column',
        padding: '80px',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        Glow({ top: '-100px', left: '-100px', color: BRAND.pink }),
        Logo({ colors }),
        // Big quote mark
        {
          type: 'div',
          props: {
            style: {
              color: BRAND.accent,
              fontSize: '240px',
              fontWeight: 'bold',
              lineHeight: 0.8,
              marginTop: '20px',
              zIndex: 1,
              opacity: 0.3,
            },
            children: '"',
          },
        },
        {
          type: 'div',
          props: {
            style: {
              color: colors.text,
              fontSize: '62px',
              fontWeight: 'bold',
              lineHeight: 1.15,
              zIndex: 1,
              marginTop: '-60px',
              maxWidth: '900px',
            },
            children: title,
          },
        },
        subtitle ? {
          type: 'div',
          props: {
            style: {
              color: BRAND.accent,
              fontSize: '24px',
              marginTop: '32px',
              zIndex: 1,
              fontWeight: 'bold',
              letterSpacing: '1px',
            },
            children: '— ' + subtitle,
          },
        } : null,
        cta ? {
          type: 'div',
          props: {
            style: {
              marginTop: '40px',
              background: BRAND.accent,
              color: '#fff',
              fontSize: '20px',
              padding: '14px 36px',
              borderRadius: '6px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
              zIndex: 1,
            },
            children: cta + ' →',
          },
        } : null,
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', marginTop: 'auto', zIndex: 1 },
            children: [
              Dots({ total, current: idx - 1, colors }),
              isLast
                ? { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px' }, children: 'thedataforge.in →' } }
                : { type: 'div', props: { style: { color: colors.muted, fontSize: '14px' }, children: `${idx} / ${total}` } },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

// 6. GRID — 2×2 or 2×3 card grid
function renderGrid({ slide, colors }) {
  const { title, tag, body, slide: idx, total, isLast } = slide;
  const items = body?.length > 0 ? body : [];
  // pad to even number for 2-col grid
  const gridItems = items.length % 2 !== 0 ? [...items, ''] : items;

  return {
    type: 'div',
    props: {
      style: {
        width: `${W}px`, height: `${H}px`,
        background: colors.bg,
        display: 'flex', flexDirection: 'column',
        padding: '80px',
        fontFamily: 'Inter',
        position: 'relative',
        overflow: 'hidden',
      },
      children: [
        GridBg({ colors }),
        Logo({ colors }),
        { type: 'div', props: { style: { height: '40px' } } },
        Tag({ text: tag, colors }),
        { type: 'div', props: { style: { height: '20px' } } },
        {
          type: 'div',
          props: {
            style: { color: colors.text, fontSize: '48px', fontWeight: 'bold', lineHeight: 1.1, zIndex: 1, marginBottom: '36px' },
            children: title,
          },
        },
        // 2-col grid
        {
          type: 'div',
          props: {
            style: {
              display: 'flex', flexWrap: 'wrap', gap: '16px',
              zIndex: 1, flex: 1,
            },
            children: gridItems.map((item, i) => ({
              type: 'div',
              props: {
                style: {
                  flex: '1 1 calc(50% - 8px)',
                  background: item ? colors.surface : 'transparent',
                  border: item ? `1px solid ${colors.border}` : 'none',
                  borderRadius: '8px',
                  padding: item ? '24px' : '0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                },
                children: item ? [
                  {
                    type: 'div',
                    props: {
                      style: {
                        width: '32px', height: '3px',
                        background: BRAND.accent,
                        borderRadius: '2px',
                      },
                    },
                  },
                  {
                    type: 'div',
                    props: {
                      style: { color: colors.text, fontSize: '19px', lineHeight: 1.4 },
                      children: item,
                    },
                  },
                ] : [],
              },
            })),
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', justifyContent: 'space-between', paddingTop: '32px', zIndex: 1 },
            children: [
              Dots({ total, current: idx - 1, colors }),
              isLast
                ? { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px' }, children: 'thedataforge.in →' } }
                : { type: 'div', props: { style: { color: colors.muted, fontSize: '14px' }, children: `${idx} / ${total}` } },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}

// ─────────────────────────────────────────
// LAYOUT ROUTER
// ─────────────────────────────────────────
function renderSlide({ slide, layout, theme }) {
  const colors = theme === 'light' ? BRAND.light : BRAND.dark;
  const ctx = { slide, colors };

  switch (layout) {
    case 'hero':     return renderHero(ctx);
    case 'split':    return renderSplit(ctx);
    case 'stat':     return renderStat(ctx);
    case 'timeline': return renderTimeline(ctx);
    case 'quote':    return renderQuote(ctx);
    case 'grid':     return renderGrid(ctx);
    default:         return renderSplit(ctx);
  }
}

// ─────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────
export async function POST(req) {
  try {
    const body = await req.json();

    // Accept either full slide object from carousel API,
    // or raw fields for backward compat
    const slide    = body.slide    ?? body;
    const layout   = body.layout   ?? slide.layout ?? 'split';
    const theme    = body.theme    ?? slide.theme  ?? 'dark';

    if (!slide.title) {
      return new Response(JSON.stringify({ error: 'title is required' }), { status: 400 });
    }

    const node = renderSlide({ slide, layout, theme });

    const fontRes  = await fetch('https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-700-normal.woff');
    const fontData = await fontRes.arrayBuffer();

    const svg = await satori(node, {
      width: W,
      height: H,
      fonts: [
        { name: 'Inter', data: fontData, weight: 700, style: 'normal' },
      ],
    });

    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}