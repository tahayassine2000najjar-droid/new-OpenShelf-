"use client"
import {useState} from "react"
import {useRouter} from "next/navigation"
import type {BookFormData, ValidationError , ToastState} from "../../../types/index.ts"

export default function CreateBook(){
    const router = useRouter()
    const [errors , setErrors]=useState<ValidationError>({})
    const [serverError , setServerError]=useState("") 
    const [toast , setToast]=useState<ToastState>({
        show: false,
        message: "",
        type: "",
    })
    const [formData , setFormData]=useState<BookFormData>({
        title : "",
        author : "",
        isbn :"",
        category : "",
        publicationYear : "",
        description : "",
        available :true,
    })

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
      publicationYear: parseInt(formData.publicationYear, 10),
    };
        try{
         const res = await fetch("/api/books",{
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify(data)

         })
          const result = await res.json()
         if(!res.ok){
            if(result.errors){
                setErrors(result.errors)
            }else{
                setServerError(result.error || "an Error has occurred")
         }
         return;

        }
        setToast({show : true , message : "the book has been added successfuly!" , type :"success"})
        setTimeout(()=>router.push("/"),2000)
     }catch{
        setServerError("connection server has failed !")
     }
      return (
    <div className="container">
      {toast.show && (
        <div className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      <h2>Ajouter un livre</h2>
      {serverError && <div className="error-message">{serverError}</div>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <span className="error">{errors.title[0]}</span>}
        </div>

        <div className="form-group">
          <label>Auteur *</label>
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
          <label>Catégorie *</label>
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
          <label>Année de publication *</label>
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
            Disponible
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Ajouter le livre
        </button>
      </form>
    </div>
  );
}
}