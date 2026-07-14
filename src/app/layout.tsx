
import type { Metadata } from "next";

export const metadata : Metadata = {
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
              <a href="/">About</a>
              <a href="/books/create">Add a Book</a>
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
