import "bootstrap/dist/css/bootstrap.min.css"; // นำเข้า Bootstrap ก่อน
import "@/styles/globals.css"; // นำเข้า CSS ของคุณเองหลังจากนั้น

import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  // ตรวจสอบเส้นทางว่าตรงกับ /login หรือไม่
  const isLoginPage = router.pathname === "/home" || 
  router.pathname === "/add_book" ||
  router.pathname === "/dashboard" ||
  router.pathname === "/edit_book" ||
  router.pathname === "/edit_book/[id]" ||
  router.pathname === "/bookDetail" ||
  router.pathname === "/statistic_books";

  return (
    <>
      {isLoginPage && <Navbar />} {/* แสดง Navbar เฉพาะเมื่ออยู่ในหน้า login */}
      <Component {...pageProps} />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    </>
  );
}
