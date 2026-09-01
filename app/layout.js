import '../styles/globals.css';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import ConditionalLayout from '../components/layout/ConditionalLayout';
import AuthProvider from '../components/providers/AuthProvider';
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
        {/* Anti-flicker & Anti-extension mutation scrubber: runs before hydration */}
        <Script
          id="theme-and-extension-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // 1. Apply saved theme immediately
                var savedTheme = localStorage.getItem('dona-theme');
                if (savedTheme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                  document.documentElement.classList.remove('dark');
                }

                // 2. Prevent browser extension attributes (like bis_skin_checked) from causing hydration mismatch
                var scrubExtensions = function() {
                  var els = document.querySelectorAll('[bis_skin_checked]');
                  for (var i = 0; i < els.length; i++) {
                    els[i].removeAttribute('bis_skin_checked');
                  }
                };
                scrubExtensions();

                if (typeof MutationObserver !== 'undefined') {
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked' && m.target && m.target.removeAttribute) {
                        m.target.removeAttribute('bis_skin_checked');
                      }
                    }
                  });
                  observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['bis_skin_checked'] });
                }

                // 3. Filter extension noise and unhandled chrome-extension errors
                if (typeof window !== 'undefined') {
                  window.addEventListener('error', function(e) {
                    if (e.filename && e.filename.indexOf('chrome-extension://') !== -1) {
                      e.stopImmediatePropagation();
                      e.preventDefault();
                    }
                  }, true);

                  window.addEventListener('unhandledrejection', function(e) {
                    var str = (e && e.reason && (e.reason.stack || e.reason.message || String(e.reason))) || '';
                    if (str.indexOf('chrome-extension://') !== -1 || str.indexOf('M_ID') !== -1) {
                      e.stopImmediatePropagation();
                      e.preventDefault();
                    }
                  }, true);

                  var origError = console.error;
                  console.error = function() {
                    var msg = arguments[0];
                    if (typeof msg === 'string' && (msg.indexOf('bis_skin_checked') !== -1 || (msg.indexOf('hydration-mismatch') !== -1 && JSON.stringify(Array.from(arguments)).indexOf('bis_skin_checked') !== -1))) {
                      return;
                    }
                    origError.apply(console, arguments);
                  };
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <AudioPlayerProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </AudioPlayerProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
