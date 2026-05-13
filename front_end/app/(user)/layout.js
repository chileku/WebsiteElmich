import Header from "@/component/user/header";
import Footer from "@/component/user/footer";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
});
export default function UserLayout({ children }) {
  return (
    <div className={`${quicksand.className} bg-gray-100`}>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
