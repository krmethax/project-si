import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

export default function AddBook() {
    const router = useRouter();

    // State for book details
    const [bookDetails, setBookDetails] = useState({
        image: "",
        bookname: "",
        price: "",
        yearPublished: "",
        pages: "",
        author: "",
        type: "" // Field for book type
    });

    // State for image preview, error handling, and loading state
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Check if the user is logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem("token");
        if (!isLoggedIn) {
            router.push("/login");
        }
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "image") {
            try {
                new URL(value);
                setImagePreview(value);
                setBookDetails({ ...bookDetails, image: value });
                setError(null);
            } catch {
                setError("กรุณาใส่ URL รูปภาพที่ถูกต้อง");
                setImagePreview(null);
            }
        } else {
            setBookDetails({ ...bookDetails, [name]: value });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const response = await fetch('http://localhost:8000/api/books/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([bookDetails]), // Send as an array
        });

        const data = await response.json();
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'หนังสือได้ถูกเพิ่มแล้ว',
            });
            // Optionally, clear the form
            setBookDetails({
                image: "",
                bookname: "",
                price: "",
                yearPublished: "",
                pages: "",
                author: "",
                type: "" // Reset book type field
            });
            setImagePreview(null);
        } else {
            console.error('Error:', data);
            setError('ไม่สามารถเพิ่มหนังสือได้');
        }
        setLoading(false);
    };

    // Remove image function
    const handleRemoveImage = () => {
        setBookDetails({ ...bookDetails, image: "" });
        setImagePreview(null);
    };

    return (
        <div className="container mt-3">
            <h3 className="text-center mb-4">เพิ่มหนังสือ</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex">
                <div className="me-4" style={{ flex: '0 0 200px' }}>
                    {imagePreview && (
                        <div>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="img-thumbnail"
                                style={{ maxWidth: "100%", maxHeight: "200px", objectFit: 'cover' }}
                            />
                            <button
                                type="button"
                                className="btn btn-danger mt-2 w-75"
                                onClick={handleRemoveImage}
                            >
                                ลบรูปภาพ
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-grow-1">
                    <form onSubmit={handleSubmit}>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><label className="form-label">URL รูปภาพ</label></td>
                                    <td>
                                        <input
                                            type="text"
                                            name="image"
                                            placeholder="URL รูปภาพ"
                                            className="form-control"
                                            value={bookDetails.image}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">ชื่อหนังสือ</label></td>
                                    <td>
                                        <input
                                            type="text"
                                            name="bookname"
                                            placeholder="ชื่อหนังสือ"
                                            className="form-control"
                                            value={bookDetails.bookname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">ราคา</label></td>
                                    <td>
                                        <input
                                            type="number"
                                            name="price"
                                            placeholder="ราคา"
                                            className="form-control"
                                            value={bookDetails.price}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">ปีที่พิมพ์</label></td>
                                    <td>
                                        <input
                                            type="number"
                                            name="yearPublished"
                                            placeholder="ปีที่พิมพ์"
                                            className="form-control"
                                            value={bookDetails.yearPublished}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">จำนวนหน้า</label></td>
                                    <td>
                                        <input
                                            type="number"
                                            name="pages"
                                            placeholder="จำนวนหน้า"
                                            className="form-control"
                                            value={bookDetails.pages}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">ผู้แต่ง</label></td>
                                    <td>
                                        <input
                                            type="text"
                                            name="author"
                                            placeholder="ผู้แต่ง"
                                            className="form-control"
                                            value={bookDetails.author}
                                            onChange={handleChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><label className="form-label">ประเภทหนังสือ</label></td>
                                    <td>
                                        <select
                                            name="type"
                                            className="form-select"
                                            value={bookDetails.type}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">เลือกประเภทหนังสือ</option>
                                            <option value="นิยายและวรรณกรรม">นิยายและวรรณกรรม</option>
                                            <option value="วิทยาการและเทคโนโลยี">วิทยาการและเทคโนโลยี</option>
                                            <option value="ประวัติศาสตร์และวัฒนธรรม">ประวัติศาสตร์และวัฒนธรรม</option>
                                            <option value="การศึกษาและการเรียนรู้">การศึกษาและการเรียนรู้</option>
                                            <option value="ธุรกิจและการเงิน">ธุรกิจและการเงิน</option>
                                            <option value="สุขภาพและการดูแลรักษา">สุขภาพและการดูแลรักษา</option>
                                            <option value="ศาสนาและปรัชญา">ศาสนาและปรัชญา</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary me-2 w-25" disabled={loading}>
                                {loading ? 'กำลังเพิ่ม...' : 'เพิ่มหนังสือ'}
                            </button>
                            <a href="/dashboard" className="btn btn-warning text-white w-25">ยกเลิก</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
