// pages/bookDetail.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchBookDetail();
        }
    }, [id]);

    const fetchBookDetail = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/books/${id}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch book detail');
            }
            const data = await response.json();
            setBook(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-3">
            <h3 className="text-center">รายละเอียดหนังสือ</h3>
            <hr />

            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {book && (
                <div className="row mt-3">
                    <div className="col-md-4 mt-3">
                        <img src={book.image} alt={book.bookname} className="img-fluid" />
                    </div>
                    <div className="col-md-8">
                        <table className="table table-bordered mt-3">
                            <tbody>
                                <tr>
                                    <th>ชื่อหนังสือ</th>
                                    <td>{book.bookname}</td>
                                </tr>
                                <tr>
                                    <th>ราคา</th>
                                    <td>{book.price}</td>
                                </tr>
                                <tr>
                                    <th>ปีที่พิมพ์</th>
                                    <td>{book.yearPublished}</td>
                                </tr>
                                <tr>
                                    <th>จํานวนหน้า</th>
                                    <td>{book.pages}</td>
                                </tr>
                                <tr>
                                    <th>หมวดหมู่</th>
                                    <td>{book.type}</td>
                                </tr>
                                <tr>
                                    <th>รายละเอียด</th>
                                    <td> - </td>
                                </tr>
                                <tr>
                                    <th>ผู้แต่ง</th>
                                    <td>{book.author}</td>
                                </tr>
                            </tbody>
                        </table>
                        <a href='/home'>กลับ</a>
                    </div>
                </div>
            )}
        </div>
    );
}
