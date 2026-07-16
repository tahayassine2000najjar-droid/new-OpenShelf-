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
    showToast("Êtes-vous sûr de vouloir supprimer ce livre ?", "confirm");
  };

  const handleConfirmDelete = async () => {
    const id = pendingDeletedId;
    setPendingDeleteId(null);
    setToast({ show: false, message: "", type: "" });
    try {
      const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBooks(books.filter((book) => book._id !== id));
        showToast("Le livre a été supprimé avec succès", "success");
      } else {
        showToast("Erreur lors de la suppression du livre", "error");
      }
    } catch {
      showToast("Erreur de connexion", "error");
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
        <h2>Chargement...</h2>
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
                Confirmer
              </button>
              <button
                className="toast-btn toast-cancel"
                onClick={handleCancelDelete}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      )}

      <h2>Catalogue des Livres</h2>
      <p className="subtitle">
        Découvrez notre collection de livres disponibles à l&apos;emprunt
      </p>

      <div className="top-bar">
        <input
          type="text"
          placeholder="Rechercher par titre ou auteur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Tous</option>
          <option value="available">Disponible</option>
          <option value="borrowed">Emprunté</option>
        </select>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="no-results">Aucun livre trouvé</p>
      ) : (
        <div className="books">
          {filteredBooks.map((book) => (
            <div className="card" key={book._id}>
              <h3>{book.title}</h3>
              <p>
                <strong>Auteur :</strong> {book.author}
              </p>
              <p>
                <strong>Catégorie :</strong> {book.category}
              </p>
              <p>
                <strong>Année :</strong> {book.publicationYear}
              </p>
              <span className={book.available ? "available" : "borrowed"}>
                {book.available ? "Disponible" : "Emprunté"}
              </span>
              <div className="actions">
                <Link href={`/books/${book._id}`}>
                  <button>Voir détails</button>
                </Link>
                <Link href={`/books/edit/${book._id}`}>
                  <button className="edit">Modifier</button>
                </Link>
                <button
                  className="delete"
                  onClick={() => handleDeleteClick(book._id)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
