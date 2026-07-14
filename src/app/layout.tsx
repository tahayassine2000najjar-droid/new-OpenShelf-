import Link from "next/link";
import "./global.css";
import type { Metadata } from "next";

export const metadata = {
  title: "OpenShelf",
  description: "Catalog of books of the online library",
};

export default function RootLayout({
  children,

}:{
  children : React.ReactNode;

}) {
  return (
    <html lang="en">
      <body>
        <div className="overlay">
          <header>
            <h1>
              OpenShelf
            </h1>
            <nav>
              <link href="/" >About</link>
              <link href="/books/create" >Add a Book</link>
            </nav>
          </header>
          <main>{children}</main>
          <footer>
            <p>Online Library &copy; {new Date().getFullYear()}</p>
          </footer>
        </div>
      </body>
    </html>

  );
}
