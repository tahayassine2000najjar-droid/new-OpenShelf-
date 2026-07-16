"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import type { BookFormData, ValidationError, ToastState } from "@/types";

export default function EditBook() {
  const router = useRouter();
  const params = useParams();
  const [errors, setErrors] = useState<ValidationError>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState<BookFormData>({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publicationYear: "",
    description: "",
    available: true,
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${params.id}`);
        if (!res.ok) {
          setServerError("Book not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setFormData({
          title: data.title,
          author: data.author,
          isbn: data.isbn,
          category: data.category,
          publicationYear: data.publicationYear,
          description: data.description,
          available: data.available,
        });
      } catch {
        setServerError("Error occurred while loading the book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      e.target instanceof HTMLInputElement ? e.target.checked : false;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const data = {
      ...formData,
      publicationYear: parseInt(String(formData.publicationYear), 10),
    };

    try {
      const res = await fetch(`/api/books/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setServerError(result.error || "An error occurred!");
        }
        return;
      }

      setToast({ show: true, message: "Book updated successfully!", type: "success" });
      setTimeout(() => router.push(`/books/${params.id}`), 2000);
    } catch {
      setServerError("Server connection error");
    }
  };

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
        </div>
      )}

      <h2>Edit Book</h2>
      {serverError && <div className="error-message">{serverError}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title[0]}</span>}
        </div>

        <div className="form-group">
          <label>Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
          />
          {errors.author && <span className="error">{errors.author[0]}</span>}
        </div>

        <div className="form-group">
          <label>ISBN *</label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
          />
          {errors.isbn && <span className="error">{errors.isbn[0]}</span>}
        </div>

        <div className="form-group">
          <label>Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
          {errors.category && (
            <span className="error">{errors.category[0]}</span>
          )}
        </div>

        <div className="form-group">
          <label>Publication Year *</label>
          <input
            type="number"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
          />
          {errors.publicationYear && (
            <span className="error">{errors.publicationYear[0]}</span>
          )}
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
          {errors.description && (
            <span className="error">{errors.description[0]}</span>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}
