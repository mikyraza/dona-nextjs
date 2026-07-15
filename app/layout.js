import '../styles/globals.css';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import ConditionalLayout from '../components/layout/ConditionalLayout';
import Script from 'next/script';

export const metadata = {
  title: 'DONA MAGAZINE - Architecture & Design',
  description: 'Un espace dédié à la curation architecturale et aux privilèges exclusifs.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Newsreader:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        {/* Anti-flicker: runs before paint to apply saved theme */}
        <Script
          id="theme-initializer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('dona-theme');
                if (savedTheme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.classList.remove('dark');
                }
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'light');
                document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AudioPlayerProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AudioPlayerProvider>
      </body>
    </html>
  );
}
