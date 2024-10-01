import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

export default function EditBook() {
    const router = useRouter();
    const { id } = router.query;

    const [bookDetails, setBookDetails] = useState({
        image: "",
        bookname: "",
        price: "",
        yearPublished: "",
        pages: "",
        author: "",
        type: "" // Added type field
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (id) {
            fetchBook(id);
        }
    }, [id]);

    const fetchBook = async (bookId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/books/${bookId}/`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch book');
            }
            const data = await response.json();
            setBookDetails(data); // Set book details to state
            setImagePreview(data.image); // Set image preview
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookDetails({ ...bookDetails, [name]: value }); // Update book details

        if (name === "image") {
            setImagePreview(value); // Update image preview when the URL changes
        }
    };

    const handleImageRemove = () => {
        setBookDetails({ ...bookDetails, image: "" });
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Simple validation
        if (!bookDetails.bookname || !bookDetails.price || !bookDetails.yearPublished) {
            setError("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/books/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookDetails),
            });

            if (response.ok) {
                Swal.fire('สำเร็จ!', 'ข้อมูลหนังสือได้รับการอัปเดตเรียบร้อยแล้ว', 'success');
                router.push('/dashboard');
            } else {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update book');
            }
        } catch (err) {
            Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-3">
            <h3 className="text-center mb-4">แก้ไขหนังสือ</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-info">กำลังโหลด...</div>}

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
                                onClick={handleImageRemove}
                            >
                                ลบรูปภาพ
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex-grow-1">
                    <form onSubmit={handleSubmit}>
                        <table className="table align-middle" style={{ width: "100%" }}>
                            <tbody>
                                <tr className="align-middle">
                                    <td>ID</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="id"
                                            placeholder="ID"
                                            className="form-control"
                                            value={id}
                                            readOnly
                                        />
                                    </td>
                                </tr>
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
                            <button type="submit" className="btn btn-primary me-2 p-2" disabled={loading}>
                                {loading ? 'กำลังอัปเดต...' : 'อัปเดตหนังสือ'}
                            </button>
                            <a href="/dashboard" className="btn btn-warning text-white p-2">ยกเลิก</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
