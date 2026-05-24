import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import { ThemeControls } from "./theme-controls";

export const metadata: Metadata = {
  title: "Ramasri Shift",
  description: "Ramasri Shift — reserve your shift day, first come, first served.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="indigo" data-mode="light" suppressHydrationWarning>
      <body>
        {/* Runs synchronously before first paint — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('rs_theme')||'indigo';var m=localStorage.getItem('rs_mode')||'light';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('data-mode',m);}catch(e){}`,
          }}
        />
        <ThemeProvider>
          <header className="site-header">
            <Link href="/" className="brand">
              <span className="brand-dot" />
              Ramasri Shift
            </Link>
            <div className="header-right">
              <nav className="site-nav">
                <Link href="/">Calendar</Link>
                <Link href="/my">My Days</Link>
                <Link href="/scoreboard">Scoreboard</Link>
                <Link href="/admin">Admin</Link>
              </nav>
              <ThemeControls />
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            Ramasri Shift &middot; first come, first served &middot; one person per day
            <span className="footer-credit">&nbsp;&#x2767;&nbsp;don</span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
