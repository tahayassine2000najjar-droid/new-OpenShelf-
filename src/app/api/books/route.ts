import connectDB from "@/lib/mongodb";
import Book from "@/models/Book"
import { bookSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { request } from "node:http";

export async function GET(){
    try{
        connectDB()
        const books = await Book.find({}).sort({createdAt : -1})
        return Response.json(books , {status: 200})
    }catch{
        return Response.json(
            {error : "error occurred while loading the books"},
            {status : 500}


        )
    }
}
export async function POST( post : nextRequest){
    try{
        connectDB()
        const body = await request.json()
        const result = bookSchema.safeParse(body)
        if(!result.success){
        const errors = result.errors.flatten().fieldErrors    
        }
    }
}