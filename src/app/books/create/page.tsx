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

    const handleChange =(
        e: react.changeEvent<HTMLInputElement | HTMLTextAreaElement>)
        =>{
            const [name , value , type]=e.target;
            const checked = 
            e.target instanceof HTMLInputElement ? e.target.checked : false;
            setFormData({
                ...formData,
                [name] : type === "checkbox" ? checked : value ;

            })
        };

        const handleSubmit = async (e : React.FormEvent<HtmlFormElement>)=>{
            e.preventDefault()
            setErrors({})
            setServerError("")

            const data ={
                ...formData ,
            publicationYear : parseInt(formData.publicationYear , 10)
        };
        try{
         const res = await fetch("/api/books",{
            method : "POST",
            headers : {"Content-Type : application/json"},
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
        setTimeout()

        }






}