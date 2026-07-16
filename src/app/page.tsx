"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { IBook, ToastState } from "@/types";

export default function Home() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "",
  });

  const [pendingDeletedId, setPendingDeleteId] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: ToastState["type"]) => {
    setToast({ show: true, message, type });
    if (type !== "confirm") {
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadBooks() {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        if (!cancelled) {
          setBooks(data);
        }
      } catch {
        console.error("Error Loading Books");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadBooks();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
    showToast("Are you sure you want to delete this book?", "confirm");
  };

  const handleConfirmDelete = async () => {
    const id = pendingDeletedId;
    setPendingDeleteId(null);
    setToast({ show: false, message: "", type: "" });
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBooks(books.filter((book) => book._id !== id));
        showToast("Book deleted successfully", "success");
      } else {
        showToast("Error deleting the book", "error");
      }
    } catch {
      showToast("Connection error", "error");
    }
  };

  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setToast({ show: false, message: "", type: "" });
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase());

    if (filter === "available") return matchesSearch && book.available;
    if (filter === "borrowed") return matchesSearch && !book.available;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          {toast.type === "confirm" && (
            <div className="toast-actions">
              <button
                className="toast-btn toast-confirm"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
              <button
                className="toast-btn toast-cancel"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <h2>Book Catalog</h2>
      <p className="subtitle">
        Browse our collection of books available for borrowing
      </p>

      <div className="top-bar">
        <div className="search-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-wrapper">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="borrowed">Borrowed</option>
          </select>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="no-results">No books found</p>
      ) : (
        <div className="books">
          {filteredBooks.map((book) => (
            <div className="book" key={book._id}>
              <div className="book-spine"></div>
              <div className="book-pages"></div>
              <div className="book-cover">
                <div className="book-cover-inner">
                  <span className="book-category">{book.category}</span>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <div className="book-year">{book.publicationYear}</div>
                  <span className={book.available ? "book-status available" : "book-status borrowed"}>
                    {book.available ? "Available" : "Borrowed"}
                  </span>
                </div>
                <div className="book-actions">
                  <Link href={`/books/${book._id}`}>
                    <button>View Details</button>
                  </Link>
                  <Link href={`/books/edit/${book._id}`}>
                    <button className="edit">Edit</button>
                  </Link>
                  <button
                    className="delete"
                    onClick={() => handleDeleteClick(book._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
