import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenShelf",
  description: "Catalog of books of the online library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="overlay">
          <header>
            <h1>OpenShelf</h1>
            <nav>
              <Link href="/">Accueil</Link>
              <Link href="/books/create">Ajouter un livre</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            <p>OpenShelf &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
