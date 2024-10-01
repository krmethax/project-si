import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Swal from "sweetalert2";
import CountUp from "react-countup";

export default function ManageBooks() {
    const router = useRouter();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortCriterion, setSortCriterion] = useState("price");
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 10;

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("token");
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            fetchBooks();
        }
    }, [sortCriterion]);

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

    const handleDelete = async (bookId) => {
        const confirmed = await Swal.fire({
            title: 'คุณแน่ใจไหม?',
            text: "คุณจะไม่สามารถย้อนกลับได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (confirmed.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8000/api/books/${bookId}/`);
                setBooks(books.filter(book => book._id !== bookId));
                Swal.fire('ลบแล้ว!', 'หนังสือของคุณถูกลบแล้ว.', 'success');
            } catch (error) {
                Swal.fire('ข้อผิดพลาด!', 'ไม่สามารถลบหนังสือได้.', 'error');
                console.error('Error deleting the book:', error);
            }
        }
    };

    const handleSortChange = (e) => {
        setSortCriterion(e.target.value);
    };

    const sortedBooks = books.slice().sort((a, b) => {
        if (sortCriterion === "price") {
            return a.price - b.price;
        } else if (sortCriterion === "yearPublished") {
            return a.yearPublished - b.yearPublished;
        } else if (sortCriterion === "pages") {
            return a.pages - b.pages;
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
    const currentBooks = sortedBooks.slice(
        (currentPage - 1) * booksPerPage,
        currentPage * booksPerPage
    );

    return (
        <div className="container-fluid mt-3">
            <h3 className="text-center mb-4">จัดการหนังสือ</h3>
            <hr />

            <div className="d-flex justify-content-between ">
                <select
                    className="form-select w-48 py-2 px-3 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={sortCriterion}
                    onChange={handleSortChange}
                >
                    <option value="price">เรียงตามราคา</option>
                    <option value="yearPublished">เรียงตามปีที่พิมพ์</option>
                    <option value="pages">เรียงตามจำนวนหน้า</option>
                </select>
            </div>
            <br/>
            {loading && <p>กำลังโหลด...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center align-middle">
                            <thead>
                                <tr>
                                    <th className="bg-dark text-white">ภาพ</th>
                                    <th className="bg-dark text-white">ชื่อหนังสือ</th>
                                    <th className="bg-dark text-white">ประเภทหนังสือ</th>
                                    <th className="bg-dark text-white">ราคา</th>
                                    <th className="bg-dark text-white">ปีที่พิมพ์</th>
                                    <th className="bg-dark text-white">จำนวนหน้า</th>
                                    <th className="bg-dark text-white">ผู้แต่ง</th>
                                    <th className="bg-dark text-white">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentBooks.map((book) => (
                                    <tr key={book._id}>
                                        <td>
                                            {book.image && (
                                                <img
                                                    src={book.image}
                                                    alt={book.bookname}
                                                    style={{ width: "100px", height: "150px", objectFit: "cover" }}
                                                />
                                            )}
                                        </td>
                                        <td>{book.bookname}</td>
                                        <td>{book.type}</td>
                                        <td>{book.price}</td>
                                        <td>{book.yearPublished}</td>
                                        <td>{book.pages}</td>
                                        <td>{book.author}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning me-2 p-2"
                                                onClick={() => router.push(`/edit_book/${book._id}`)}
                                            >
                                                แก้ไข
                                            </button>
                                            <button
                                                className="btn btn-danger p-2"
                                                onClick={() => handleDelete(book._id)}
                                            >
                                                ลบ
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <nav aria-label="Page navigation">
                            <ul className="pagination justify-content-end mt-4">
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        &laquo; ก่อนหน้า
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        ถัดไป &raquo;
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </>
            )}
        </div>
    );
}
