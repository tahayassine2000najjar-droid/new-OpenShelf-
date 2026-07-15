"use client"
import {useState} from "react"
import {useRouter} from "next/navigation"
import type {BookFormData, ValidationError , ToastState} from "../../../types/index.ts"

export default function CreateBook(){
    const router = useRouter()
    const [errors , setErrors]=useState<ValidationError>({})
}