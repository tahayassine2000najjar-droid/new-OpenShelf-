"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { IBook } from "@/types";

export default function BookDetail() {
  const params = useParams();
  const [book, setBook] = useState<IBook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        if (!res.ok) {
          setError("Book not found!");
          return;
        }
        const data = await res.json();
        setBook(data);
      } catch {
        setError("Error occurred while loading the book!");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link href="/">
          <button>Back to Home</button>
        </Link>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="container">
      <h2>Book Details</h2>
      <div className="detail-card">
        <h3>{book.title}</h3>
        <p>
          <strong>Author:</strong> {book.author}
        </p>
        <p>
          <strong>ISBN:</strong> {book.isbn}
        </p>
        <p>
          <strong>Category:</strong> {book.category}
        </p>
        <p>
          <strong>Publication Year:</strong> {book.publicationYear}
        </p>
        <p>
          <strong>Description:</strong> {book.description}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={book.available ? "available" : "borrowed"}>
            {book.available ? "Available" : "Borrowed"}
          </span>
        </p>
        <div className="actions">
          <Link href={`/books/edit/${book._id}`}>
            <button className="edit">Edit</button>
          </Link>
          <Link href="/">
            <button>Back</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
