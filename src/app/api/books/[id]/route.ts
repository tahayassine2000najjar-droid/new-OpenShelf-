import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import { bookSchema } from "@/lib/validations";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const book = await Book.findById(id);
    if (!book) {
      return Response.json(
        { error: "book no found!" },
        { status: 404 }
      );
    }
    return Response.json(book, { status: 200 });
  } catch {
    return Response.json(
      { error: "Error occurred while loading book!" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const result = bookSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return Response.json({ errors }, { status: 400 });
    }

    const existingBook = await Book.findOne({
      isbn: result.data.isbn,
      _id: { $ne: id },
    });
    if (existingBook) {
      return Response.json(
        { errors: { isbn: ["this isbn already existing"] } },
        { status: 400 }
      );
    }

    const book = await Book.findByIdAndUpdate(id, result.data, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return Response.json(
        { error: "book not found" },
        { status: 404 }
      );
    }

    return Response.json(book, { status: 200 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return Response.json(
        { errors: { isbn: ["this isbn already existing"] } },
        { status: 400 }
      );
    }
    return Response.json(
      { error: "Error updating book!" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return Response.json(
        { error: "book not found" },
        { status: 404 }
      );
    }
    return Response.json(
      { message: "book deleted successfuky" },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Error occure while deleting the book!" },
      { status: 500 }
    );
  }
}
