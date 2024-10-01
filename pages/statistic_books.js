import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Statistics() {
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
                throw new Error('ไม่สามารถดึงข้อมูลหนังสือได้');
            }
            const data = await response.json();
            setBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const bookCountsByType = books.reduce((acc, book) => {
        if (book.type) {
            acc[book.type] = (acc[book.type] || 0) + 1;
        }
        return acc;
    }, {});

    const totalBooks = books.length;

    return (
        <div className="container mt-3">
            <h3 className="text-center mb-4">สถิติข้อมูลหนังสือ</h3>

            {loading && <p className="text-center">กำลังโหลด...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="row mb-4">
                        <div className="col-md-6 mb-3">
                            <div className="card border-primary">
                                <div className="card-header bg-primary text-white">
                                    จำนวนหนังสือทั้งหมด
                                </div>
                                <div className="card-body text-center">
                                    <h4 className="card-title">{totalBooks}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="card border-success">
                                <div className="card-header bg-success text-white">
                                    จำนวนหนังสือตามประเภท
                                </div>
                                <div className="card-body">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ประเภท</th>
                                                <th>จำนวน</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.keys(bookCountsByType).map((type) => (
                                                <tr key={type}>
                                                    <td>{type}</td>
                                                    <td>{bookCountsByType[type]}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
