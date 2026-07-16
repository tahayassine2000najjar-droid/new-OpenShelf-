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
        const errors = result.error.flatten().fieldErrors ;
        return Response.json({errors},{status : 400})    
        }
        const existingBook = await Book.findOne({isbn: result.data.isbn})
        if(existingBook){
            return Response.json(
                {error : {isbn : ["this isbn is already existing"]}},
                {status : 400}
            )

        }
        const book = await Book.create(result.data)
        return Response.json(book , {status : 201} )
    }catch(error : unknown){
        if (
            typeof error === "object" && 
            error !== null &&
            "code" in error && 
            (error as {code : number}).code === 11000
        ){
            return Response.json(
                {error : {isbn : ["this isbn is already existing"]}},
                {status : 400}  
            )
        }
         return Response.json(
                {error : {isbn : ["this isbn is already existing"]}},
                {status : 400}
            )
    }
}