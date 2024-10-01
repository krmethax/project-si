// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Dashboard() {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("token");
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            fetchBooks();
        }
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/books/');
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-3">
            <h3 className="text-center">หนังสือทั้งหมด</h3>
            <hr />

            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (

                <div className="row mt-3">
                    {books.map((book) => (
                        <div className="col-12 col-md-3 mb-3" key={book._id}>
                            <Link href={`/bookDetail?id=${book._id}`}>
                                <div className="text-center">
                                    <img src={book.image} alt={book.bookname} className="mx-auto d-block mb-3" width={100} height={150} />
                                    <p>{book.bookname}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}