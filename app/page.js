import Link from 'next/link';

export default function Home() {
  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '80px 40px',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      <p style={{
        fontSize: '11px',
        fontFamily: 'var(--font-primary)',
        letterSpacing: '0.3em',
        color: 'var(--color-accent)',
        fontWeight: '600',
        marginBottom: '24px',
        textTransform: 'uppercase',
      }}>
        Plateforme éditoriale exclusive
      </p>

      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: '400',
        letterSpacing: '0.08em',
        lineHeight: '1.1',
        marginBottom: '30px',
        color: 'var(--color-text)',
      }}>
        DONA MAGAZINE
      </h1>

      <p style={{
        maxWidth: '560px',
        fontSize: '16px',
        lineHeight: '1.9',
        color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-primary)',
        fontWeight: '300',
        marginBottom: '50px',
      }}>
        Un espace dédié à l'excellence éditoriale, à la curation architecturale
        et aux privilèges exclusifs des femmes de pouvoir.
      </p>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/today" style={{
          display: 'inline-block',
          padding: '14px 36px',
          backgroundColor: 'var(--color-accent)',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.2em',
          textDecoration: 'none',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-primary)',
          transition: 'opacity 0.3s ease',
        }}>
          Édition du jour
        </Link>
        <Link href="/magazines" style={{
          display: 'inline-block',
          padding: '14px 36px',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.2em',
          textDecoration: 'none',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-primary)',
          transition: 'all 0.3s ease',
        }}>
          Nos magazines
        </Link>
      </div>
    </section>
  );
}
