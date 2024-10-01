import React from "react";
import { useRouter } from "next/router";


export default function Navbar() {
    const router = useRouter();

    // เช็ค username ใน localStorage

    // ฟังก์ชันสำหรับออกจากระบบ
    const handleLogout = () => {
        localStorage.removeItem("token"); // ลบ token จาก localStorage
        router.push("/"); // เปลี่ยนเส้นทางไปยังหน้า login
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg p-3">
                <div className="container-fluid">
                    <a className="navbar-brand text-white" href="/home">ระบบจัดการหนังสือ</a>
                    <button className="navbar-toggler " style={{ backgroundColor: "#fff" }} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/home">หนังสือทั้งหมด</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/add_book">เพิ่มหนังสือ</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/dashboard">จัดการ</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-white" href="/statistic_books">สถิติหนังสือ</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-danger" href="/" onClick={handleLogout}>ออกจากระบบ</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}
