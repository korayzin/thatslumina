/**
 * Dynamic Open Graph image endpoint (Vercel Edge).
 * Query params: title, description, type (article|page)
 *
 * @example /api/og?title=Lumina&description=Dijital%20ortaklik&type=page
 */

export const config = {
  runtime: 'edge',
};

/** @type {Record<string, string>} */
const BRAND = {
  bg: '#0A0E2F',
  surface: '#163384',
  text: '#EAE8DC',
  muted: '#E3D7AC',
  accent: '#F4F1E4',
};

/**
 * @param {string | null} value
 * @param {number} max
 * @returns {string}
 */
function clip(value, max) {
  const text = (value || 'Lumina').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const title = clip(searchParams.get('title'), 90);
  const description = clip(searchParams.get('description'), 160);
  const type = searchParams.get('type') === 'article' ? 'Makale' : 'Sayfa';

  const { ImageResponse } = await import('@vercel/og');

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: `linear-gradient(135deg, ${BRAND.bg} 0%, ${BRAND.surface} 100%)`,
          padding: '72px',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          color: BRAND.text,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                fontSize: '28px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: BRAND.muted,
              },
              children: ["That's Lumina · ", type],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                maxWidth: '980px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '64px',
                      fontWeight: 700,
                      lineHeight: 1.1,
                      color: BRAND.accent,
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: '30px',
                      lineHeight: 1.4,
                      color: BRAND.text,
                      opacity: 0.92,
                    },
                    children: description,
                  },
                },
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                fontSize: '24px',
                color: BRAND.muted,
              },
              children: 'www.thatslumina.com',
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
    }
  );
}
