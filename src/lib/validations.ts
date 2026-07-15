import {z} from "zod"

export const bookSchema = z.object({
    title : z.string().min(3 , "the title have to be at least 3 letters"),
    author : z.string().min(1 , "the author is mandatory"),
    isbn : z.string().min(1 , "the isbn is mandatory"),
    category : z.string().min(1 , "the category is mandatory"),
    publicationYear : z.number()
        .int("The year must be an integer")
        .min(1000,"the year is invalid")
        .max(new Date().getFullYear() + 1 , "the year is invalid"),
    description : z.string()
        .min(10 , "the description have to be at least 10 letters"),
    available :z.boolean().optional()

})

export type BookInput = z.infer<typeof bookSchema> ;
 