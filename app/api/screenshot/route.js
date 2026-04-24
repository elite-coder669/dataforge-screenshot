import satori from 'satori';
import sharp from 'sharp';


export const runtime = 'nodejs';

const BRAND = {
  bg: '#0a0a0a', surface: '#111111', border: '#1e1e1e',
  accent: '#ff3366', accentSecondary: '#ff6b35', text: '#ffffff',
  textMuted: '#888888', pink: '#e91e8c', orange: '#f5a623',
  purple: '#7c3aed', blue: '#3b82f6',
};

export async function POST(req) {
  try {
    const { title, subtitle, body, tag, slide = 1, total = 5, isFirst = false, isLast = false } = await req.json();

    if (!title) return new Response(JSON.stringify({ error: 'title is required' }), { status: 400 });

    const dots = Array.from({ length: total }, (_, i) => i);

    const node = {
      type: 'div',
      props: {
        style: { width: '1080px', height: '1080px', background: BRAND.bg, display: 'flex', flexDirection: 'column', padding: '80px', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden' },
        children: [
          { type: 'div', props: { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `linear-gradient(${BRAND.border} 1px, transparent 1px), linear-gradient(90deg, ${BRAND.border} 1px, transparent 1px)`, backgroundSize: '60px 60px', opacity: 0.4 } } },
          { type: 'div', props: { style: { position: 'absolute', top: '-200px', left: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${BRAND.accent}22 0%, transparent 70%)` } } },
          { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '60px', zIndex: 1 }, children: [
            { type: 'div', props: { style: { display: 'flex', flexWrap: 'wrap', width: '28px', gap: '3px' }, children: [
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.pink } } },
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.orange } } },
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.purple } } },
              { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: BRAND.blue } } },
            ]}},
            { type: 'div', props: { style: { color: BRAND.textMuted, fontSize: '16px', letterSpacing: '4px' }, children: 'DATAFORGE' } },
            { type: 'div', props: { style: { marginLeft: '8px', background: BRAND.surface, border: `1px solid ${BRAND.border}`, color: BRAND.textMuted, fontSize: '11px', padding: '3px 8px', borderRadius: '4px', letterSpacing: '2px' }, children: 'BETA' } },
          ]}},
          tag ? { type: 'div', props: { style: { display: 'flex', marginBottom: '24px', zIndex: 1 }, children: { type: 'div', props: { style: { background: `${BRAND.accent}22`, border: `1px solid ${BRAND.accent}44`, color: BRAND.accent, fontSize: '13px', padding: '6px 16px', borderRadius: '4px', letterSpacing: '2px' }, children: tag } } }} : null,
          { type: 'div', props: { style: { color: BRAND.text, fontSize: isFirst ? '72px' : '58px', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '32px', zIndex: 1, maxWidth: '900px' }, children: title } },
          { type: 'div', props: { style: { width: '80px', height: '3px', background: `linear-gradient(90deg, ${BRAND.accent}, ${BRAND.accentSecondary})`, marginBottom: '32px', zIndex: 1 } } },
          subtitle ? { type: 'div', props: { style: { color: BRAND.textMuted, fontSize: '24px', lineHeight: 1.5, marginBottom: '40px', zIndex: 1, maxWidth: '860px' }, children: subtitle } } : null,
          body && body.length > 0 ? { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '20px', zIndex: 1, flex: 1 }, children: body.map((item, i) => ({ type: 'div', props: { style: { display: 'flex', alignItems: 'flex-start', gap: '16px', background: BRAND.surface, border: `1px solid ${BRAND.border}`, padding: '20px 24px', borderRadius: '8px' }, children: [
            { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px', fontWeight: 'bold', minWidth: '24px', marginTop: '2px' }, children: `0${i + 1}` } },
            { type: 'div', props: { style: { color: BRAND.text, fontSize: '20px', lineHeight: 1.4 }, children: item } },
          ]}}))}} : null,
          { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '40px', zIndex: 1 }, children: [
            { type: 'div', props: { style: { display: 'flex', gap: '8px' }, children: dots.map((_, i) => ({ type: 'div', props: { style: { width: i === (slide - 1) ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === (slide - 1) ? BRAND.accent : BRAND.border } } })) } },
            isLast ? { type: 'div', props: { style: { color: BRAND.accent, fontSize: '18px' }, children: 'thedataforge.in →' } } : { type: 'div', props: { style: { color: BRAND.border, fontSize: '14px' }, children: `${slide} / ${total}` } },
          ]}},
        ].filter(Boolean)
      }
    };

    const svg = await satori(node, { width: 1080, height: 1080, fonts: [] });
    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
