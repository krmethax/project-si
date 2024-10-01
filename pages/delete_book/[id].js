import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";

export default function DeleteBook() {
    const router = useRouter();
    const { bookId } = router.query; // Get the bookId from the URL
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (bookId) {
            fetchBookDetails();
        }
    }, [bookId]);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/books/');
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            console.log("Fetched Books:", data); // Add this line
            setBooks(data); // Ensure the data is an array
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirmed.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/api/books/${bookId}/`);
                Swal.fire("Deleted!", "Your book has been deleted.", "success");
                router.push("/books"); // Redirect to the books list after deletion
            } catch (error) {
                Swal.fire("Error!", "Failed to delete the book.", "error");
                console.error("Error deleting the book:", error);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h3>Are you sure you want to delete this book?</h3>
            <hr />
            {book && (
                <div className="card mb-3">
                    <div className="row no-gutters">
                        <div className="col-md-4">
                            {book.image && (
                                <img
                                    src={book.image}
                                    alt={book.bookname}
                                    className="img-fluid"
                                />
                            )}
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{book.bookname}</h5>
                                <p className="card-text">Price: {book.price}</p>
                                <p className="card-text">Year Published: {book.yearPublished}</p>
                                <p className="card-text">Pages: {book.pages}</p>
                                <p className="card-text">Author: {book.author}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <button className="btn btn-danger" onClick={handleDelete}>
                Confirm Delete
            </button>
            <button className="btn btn-secondary ms-2" onClick={() => router.push("/books")}>
                Cancel
            </button>
        </div>
    );
}
