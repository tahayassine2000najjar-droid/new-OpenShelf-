import mongoose from "mongoose"

export interface IBookDocument extends mongoose.Document {
    title: string,
    author: string,
    isbn: string,
    category: string,
    publicationYear: number,
    description: string,
    available: boolean,
    createdAt: Date,
    updatedAt: Date
}

const BookSchema = new mongoose.Schema<IBookDocument>({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    author: {
        type: String,
        required: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        minlength: 10,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true,
})

const Book = (mongoose.models.Book as mongoose.Model<IBookDocument>) || mongoose.model<IBookDocument>("Book", BookSchema)

export default Book;
