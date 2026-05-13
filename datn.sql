-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 09, 2026 at 06:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datn`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `AccountID` int(11) NOT NULL,
  `FullName` varchar(255) NOT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Username` varchar(100) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Favourite` varchar(255) DEFAULT NULL,
  `Role` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`AccountID`, `FullName`, `Address`, `Phone`, `Email`, `Username`, `Password`, `Favourite`, `Role`) VALUES
(1, 'Nguyen Van A', 'Tỉnh Hà Giang, Thành phố Hà Giang, Phường', '0988888888', 'a@gmail.com', 'user1', '$2b$10$FAVv/XPdXxY9OKcne0srBOQWKYbDAm.TWPdezHd0v5Fq9D8vb0e7O', 'Điện tử', 0),
(5, 'Trịnh Quang Chí', 'Hà Nội', '0988888888', 'a1@gmail.com', 'admin', '$2b$10$A7/RIitbSn9EWjNiY2UN.OLx3b91JabfM4nFRDmE6M38K1752F2f.', '', 1),
(6, 'Nguyen Van A', 'Hà Nội', '0988888888', 'a12@gmail.com', 'user2', '$2b$10$JX/N3ZpoPR8USd3uHak5/O9BXzn4tzyvimnVjoVLP/QJuC9yNd5S2', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(255) NOT NULL,
  `ParentID` int(11) DEFAULT NULL,
  `Slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryID`, `CategoryName`, `ParentID`, `Slug`) VALUES
(1, 'Bình giữ nhiệt', NULL, 'binh-giu-nhiet'),
(2, 'Bình giữ nhiệt văn phòng', 1, 'binh-giu-nhiet-van-phong'),
(3, 'Bình giữ nhiệt gia đình', 1, 'binh-giu-nhiet-gia-dinh'),
(4, 'Bình giữ nhiệt thể thao', 1, 'binh-giu-nhiet-the-thao'),
(5, 'Cốc giữ nhiệt', 1, 'coc-giu-nhiet'),
(6, 'Cốc giữ nhiệt', 1, 'coc-giu-nhiet-1'),
(7, 'hộp bảo quản', NULL, 'hop-bao-quan'),
(8, 'hộp nhựa', 7, 'hop-nhua'),
(9, 'hộp inox', 7, 'hop-inox'),
(10, 'hộp thủy tinh', 7, 'hop-thuy-tinh'),
(14, 'Nồi/chảo', NULL, 'noichao'),
(15, 'Chảo inox', 14, 'chao-inox'),
(16, 'Nồi/Bộ nồi chảo chống dính', 14, 'noibo-noi-chao-chong-dinh'),
(30, 'Điện gia dụng', NULL, 'dien-gia-dung'),
(31, 'Máy xay sinh tố', 30, 'may-xay-sinh-to'),
(32, 'Nồi chiên không dầu', 30, 'noi-chien-khong-dau'),
(33, 'Ấm siêu tốc', 30, 'am-sieu-toc'),
(34, 'Lò vi sóng - Lò nướng', 30, 'lo-vi-song-lo-nuong'),
(35, 'Nồi cơm điện', 30, 'noi-com-dien'),
(36, 'Máy hút bụi', 30, 'may-hut-bui'),
(40, 'Dụng cụ vệ sinh', NULL, 'dung-cu-ve-sinh'),
(41, 'Bộ lau nhà', 40, 'bo-lau-nha'),
(42, 'Chổi và hót rác', 40, 'choi-hot-rac');

-- --------------------------------------------------------

--
-- Table structure for table `discount`
--

CREATE TABLE `discount` (
  `DiscountID` int(11) NOT NULL,
  `DiscountRate` decimal(5,2) NOT NULL,
  `EntryDate` datetime DEFAULT NULL,
  `ExpirationDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `discount`
--

INSERT INTO `discount` (`DiscountID`, `DiscountRate`, `EntryDate`, `ExpirationDate`) VALUES
(3, 0.50, '2026-03-23 00:00:00', '2026-04-18 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `ProductID` int(11) NOT NULL,
  `ProductName` varchar(255) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Price` decimal(15,2) NOT NULL,
  `SalePrice` decimal(15,2) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `DiscountID` int(11) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT current_timestamp(),
  `Slug` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`ProductID`, `ProductName`, `Quantity`, `Price`, `SalePrice`, `Description`, `CategoryID`, `DiscountID`, `CreatedDate`, `Slug`) VALUES
(1, 'Bình giữ nhiệt inox 304 Elmich EL8383 dung tích 510ml', 99, 519000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Thiết kế hiện đại – đường cong tinh tế, tối giản nhưng thanh thoát.\"},{\"type\":\"text\",\"text\":\"- An toàn tuyệt đối theo tiêu chuẩn châu Âu SGS, không chứa PFAS, PTFE độc hại.\"},{\"type\":\"text\",\"text\":\"- Chống dính Ceramic bền lâu, chịu tới 101.000 lần chà rửa không bong tróc.\"},{\"type\":\"text\",\"text\":\"- Bắt từ cực nhanh, tương thích hoàn hảo mọi loại bếp từ, hồng ngoại, gas.\"},{\"type\":\"text\",\"text\":\"- Tay cầm cách nhiệt Bakelite chịu 180°C an toàn khi nấu nướng.\"}]', 2, 3, '2026-03-04 15:02:22', 'binh-giu-nhiet-inox-304'),
(2, 'Bơm hút chân không Elmich EL8437', 99, 120000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Bơm hút chân không tiện lợi, thiết kế chuyên dụng cho bảo quản thực phẩm.\"},{\"type\":\"text\",\"text\":\"- Hỗ trợ rút sạch không khí, giữ thực phẩm tươi lâu hơn gấp 3 lần.\"},{\"type\":\"text\",\"text\":\"- Lực hút siêu mạnh, dễ dàng cắm sạc điện linh hoạt sử dụng.\"},{\"type\":\"text\",\"text\":\"- Phím bấm thao tác 1 chạm cực kì nhanh gọn và thân thiện.\"},{\"type\":\"text\",\"text\":\"- Chất liệu nhựa ABS siêu bền, kích thước cầm tay cực kì nhỏ gọn.\"}]', 8, NULL, '2026-03-04 20:10:32', 'bom-hut-chan-khong-elmich-el8437'),
(3, 'Bình giữ nhiệt inox 304 Elmich EL8393 dung tích 650ml', 99, 100000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Thiết kế thời trang, phong cách và tinh tế dành cho mọi lứa tuổi.\"},{\"type\":\"text\",\"text\":\"- Chất liệu inox 304 cao cấp, đạt tiêu chuẩn Châu Âu, không thôi nhiễm chất độc hại.\"},{\"type\":\"text\",\"text\":\"- Dung tích 650ml rộng rãi nhưng cực gọn nhẹ để mang theo leo núi, tập gym.\"},{\"type\":\"text\",\"text\":\"- Giữ lạnh lên tới 25h và giữ nóng tới 8h nhờ công nghệ chân không đỉnh cao.\"},{\"type\":\"text\",\"text\":\"- Nắp đậy chống tràn cấu tạo gioăng đa tầng 100% không rò rỉ nước.\"}]', 4, NULL, '2026-03-04 20:12:37', 'binh-giu-nhiet-inox-304-elmich-el8393-dung-tich-650ml'),
(13, 'Chảo chống dính vân đá elmich EDA0903SK', 99, 429000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Thiết kế phong cách Châu Âu hiện đại với mặt vân đá thời thượng.\"},{\"type\":\"text\",\"text\":\"- Hợp kim nhôm phủ chống dính ILAG 2 lớp an toàn, siêu bền, không chứa PFOA.\"},{\"type\":\"text\",\"text\":\"- Cấu tạo đa lớp dày dặn giúp đồ ăn chín đều, bảo toàn vẹn nguyên dưỡng chất.\"},{\"type\":\"text\",\"text\":\"- Trang bị đáy từ thế hệ 2 cho khả năng bắt từ và nhận diện nồi đỉnh cao.\"},{\"type\":\"text\",\"text\":\"- Rửa trôi mọi cặn dầu và cháy xém chỉ bằng một tờ giấy ăn lướt nhẹ.\"}]', 15, NULL, '2026-03-29 05:02:59', 'chao-chong-dinh-van-da-elmich-eda0903sk'),
(14, 'Chảo chống dính ceramic elmich Harmony EL5989PT', 99, 239000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Lớp men Ceramic thiên nhiên Harmony thách thức mọi vết dính xoong nồi cứng đầu.\"},{\"type\":\"text\",\"text\":\"- Phù hợp chiên rán ít hoặc không dùng mỡ, dành cho chế độ ăn eat-clean.\"},{\"type\":\"text\",\"text\":\"- Màu pastel trẻ trung mang lại diện mạo gian bếp xinh đẹp đáng mơ ước.\"},{\"type\":\"text\",\"text\":\"- Trọng lượng thiết kế êm tay, thuận tiện khi lật bánh hay hất nguyên liệu.\"},{\"type\":\"text\",\"text\":\"- Lõi hợp kim tản nhiệt ma-trận siêu tốc, xào rau muống xanh ngắt ròn tan.\"}]', 15, NULL, '2026-03-29 05:22:29', 'chao-chong-dinh-ceramic-elmich-harmony-el5989pt'),
(15, 'Bộ nồi chống dính Ceramic Elmich Harmony EL5247PT01 ', 99, 1500000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Cấu trúc đúc dầy khối chịu nhiệt lượng khổng lồ bảo đảm an toàn mọi món ninh hầm.\"},{\"type\":\"text\",\"text\":\"- Hoàn tất nhu cầu trong 1 chiếc nồi: Phi xào thịt trước khi tưới nước dùng tiện lợi.\"},{\"type\":\"text\",\"text\":\"- Bề mặt Ceramic trơn sáng láng bóng, không bong tụ như các dòng chảo sơn cũ.\"},{\"type\":\"text\",\"text\":\"- Vung nắp đậy thiết kế thu hồi hơi nước rỏ lại mặt nồi, món ức nấu luôn mọng độ ẩm.\"},{\"type\":\"text\",\"text\":\"- Bắt mâm từ siêu việt, dọn dẹp nhẹ nhàng lau phát là xong.\"}]', 16, NULL, '2026-03-29 05:56:17', 'bo-noi-chong-dinh-ceramic-elmich-harmony-el5247pt01'),
(16, 'Nồi chống dính Ceramic Elmich Classic EL5529BE20', 99, 1500000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Thiết kế hiện đại, màu sắc cực kì trẻ trung và thời thượng.\"},{\"type\":\"text\",\"text\":\"- Làm bằng hợp kim nhôm, phủ sơn chống dính Ceramic an toàn tuyệt đối.\"},{\"type\":\"text\",\"text\":\"- Núm vung và tay cầm làm bằng nhựa Bakelite chịu nhiệt lên tới 180 độ C.\"},{\"type\":\"text\",\"text\":\"- Vung phẳng tránh dồn tích tụ hơi nước ra mép gây trào cực kì an toàn.\"},{\"type\":\"text\",\"text\":\"- Tương thích rộng rãi cho mọi nhà: bếp Từ, Gas, Hồng Ngoại vô tư dùng.\"}]', 16, NULL, '2026-03-29 06:01:11', 'noi-chong-dinh-ceramic-elmich-classic-el5529be20'),
(17, 'Nồi lẩu chống dính Ceramic Elmich EL5538SK28', 99, 489000.00, NULL, '[{\"type\":\"text\",\"text\":\"- Mang lại diện mạo điểm nhấn lung linh cho mặt bàn ăn nhà bạn khi quây quần.\"},{\"type\":\"text\",\"text\":\"- Nồi chuyên lẩu cực rộng và sâu, dễ dàng chứa khối lượng khổng lồ cả rau lẫn hải sản.\"},{\"type\":\"text\",\"text\":\"- Lớp phủ men gốm Ceramic 0% PFAS và PTFE, yên tâm sử dụng ngay tại ngưỡng lửa sôi sùng sục.\"},{\"type\":\"text\",\"text\":\"- Đáy nhiều lớp ngậm nhiệt tã hỏa lên mép xòe giúp nước lẩu bùng bọt liên tục 360 độ.\"},{\"type\":\"text\",\"text\":\"- Thành vách liền lạc, chùi cọ sa tế mỡ lẩu chỉ cần 1 phát bọt biển là trong veo.\"}]', 16, NULL, '2026-03-29 06:03:58', 'noi-lau-chong-dinh-ceramic-elmich-el5538sk28'),
(6001, 'Bộ nồi Inox cao cấp Elmich Trimax Premium', 100, 2900000.00, 2500000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ NỒI INOX CAO CẤP ELMICH TRIMAX PREMIUM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Bộ nồi Inox cao cấp Elmich Trimax Premium, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'bo-noi-inox-cao-cap-elmich-trimax-premium'),
(6002, 'Chảo xào từ sâu lòng Elmich Hera vân đá xám', 100, 850000.00, 699000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CHẢO XÀO TỪ SÂU LÒNG ELMICH HERA VÂN ĐÁ XÁM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Chảo xào từ sâu lòng Elmich Hera vân đá xám, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'chao-xao-tu-sau-long-elmich-hera-van-da-xam'),
(6003, 'Nồi lẩu chống dính đa lớp Elmich vung kính 28cm', 100, 590000.00, 450000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI LẨU CHỐNG DÍNH ĐA LỚP ELMICH VUNG KÍNH 28CM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi lẩu chống dính đa lớp Elmich vung kính 28cm, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'noi-lau-chong-dinh-da-lop-elmich-vung-kinh-28cm'),
(6004, 'Bộ 3 nồi Inox 304 đáy từ Elmich vung phẳng', 100, 1800000.00, 1550000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ 3 NỒI INOX 304 ĐÁY TỪ ELMICH VUNG PHẲNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Bộ 3 nồi Inox 304 đáy từ Elmich vung phẳng, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'bo-3-noi-inox-304-day-tu-elmich-vung-phang'),
(6005, 'Chảo chống dính sâu lòng Elmich đun bếp từ 26cm', 100, 420000.00, 380000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CHẢO CHỐNG DÍNH SÂU LÒNG ELMICH ĐUN BẾP TỪ 26CM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Chảo chống dính sâu lòng Elmich đun bếp từ 26cm, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'chao-chong-dinh-sau-long-elmich-dun-bep-tu-26cm'),
(6006, 'Quánh Inox 3 lớp bắt từ siêu nhanh Elmich 16cm', 100, 350000.00, 280000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC QUÁNH INOX 3 LỚP BẮT TỪ SIÊU NHANH ELMICH 16CM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Quánh Inox 3 lớp bắt từ siêu nhanh Elmich 16cm, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'quanh-inox-3-lop-bat-tu-sieu-nhanh-elmich-16cm'),
(6007, 'Chảo chiên ngập dầu Elmich vân Ceramic trắng', 100, 550000.00, 490000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CHẢO CHIÊN NGẬP DẦU ELMICH VÂN CERAMIC TRẮNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Chảo chiên ngập dầu Elmich vân Ceramic trắng, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'chao-chien-ngap-dau-elmich-van-ceramic-trang'),
(6008, 'Bộ đỉnh nồi Inox đa năng Elmich liền khối', 100, 3200000.00, 2600000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ ĐỈNH NỒI INOX ĐA NĂNG ELMICH LIỀN KHỐI ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Bộ đỉnh nồi Inox đa năng Elmich liền khối, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'bo-dinh-noi-inox-da-nang-elmich-lien-khoi'),
(6009, 'Nồi áp suất điện đa năng Elmich nắp gài chống trào', 100, 1500000.00, 1350000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI ÁP SUẤT ĐIỆN ĐA NĂNG ELMICH NẮP GÀI CHỐNG TRÀO ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi áp suất điện đa năng Elmich nắp gài chống trào, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'noi-ap-suat-dien-da-nang-elmich-nap-gai-chong-trao'),
(6010, 'Chảo chống dính 2 mặt Elmich rán cá nguyên con', 100, 990000.00, 890000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CHẢO CHỐNG DÍNH 2 MẶT ELMICH RÁN CÁ NGUYÊN CON ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Chảo chống dính 2 mặt Elmich rán cá nguyên con, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'chao-chong-dinh-2-mat-elmich-ran-ca-nguyen-con'),
(6011, 'Nồi luộc gà cỡ đại Elmich Inox sáng bóng 32cm', 100, 1250000.00, 950000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI LUỘC GÀ CỠ ĐẠI ELMICH INOX SÁNG BÓNG 32CM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi luộc gà cỡ đại Elmich Inox sáng bóng 32cm, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'noi-luoc-ga-co-dai-elmich-inox-sang-bong-32cm'),
(6012, 'Chảo nhôm đúc nguyên khối Elmich phủ lớp titan', 100, 790000.00, 650000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CHẢO NHÔM ĐÚC NGUYÊN KHỐI ELMICH PHỦ LỚP TITAN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Chảo nhôm đúc nguyên khối Elmich phủ lớp titan, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'chao-nhom-duc-nguyen-khoi-elmich-phu-lop-titan'),
(6013, 'Bộ 2 chảo nông sâu Elmich chống dính vân kim cương', 100, 950000.00, 750000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ 2 CHẢO NÔNG SÂU ELMICH CHỐNG DÍNH VÂN KIM CƯƠNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Bộ 2 chảo nông sâu Elmich chống dính vân kim cương, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'bo-2-chao-nong-sau-elmich-chong-dinh-van-kim-cuong'),
(6014, 'Quánh khuấy bột cho bé Elmich Inox 304 an toàn 14cm', 100, 250000.00, 199000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC QUÁNH KHUẤY BỘT CHO BÉ ELMICH INOX 304 AN TOÀN 14CM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Quánh khuấy bột cho bé Elmich Inox 304 an toàn 14cm, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'quanh-khuay-bot-cho-be-elmich-inox-304-an-toan-14cm'),
(6015, 'Nồi hầm sương Elmich phủ sứ chống bám dính đen', 100, 890000.00, 790000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI HẦM SƯƠNG ELMICH PHỦ SỨ CHỐNG BÁM DÍNH ĐEN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi hầm sương Elmich phủ sứ chống bám dính đen, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 16, NULL, '2026-03-29 14:03:30', 'noi-ham-suong-elmich-phu-su-chong-bam-dinh-den'),
(6016, 'Bình giữ nhiệt Inox 316 Elmich hiển thị nhiệt độ 500ml', 100, 420000.00, 310000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH GIỮ NHIỆT INOX 316 ELMICH HIỂN THỊ NHIỆT ĐỘ 500ML ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bình giữ nhiệt Inox 316 Elmich hiển thị nhiệt độ 500ml là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'binh-giu-nhiet-inox-316-elmich-hien-thi-nhiet-do-500ml'),
(6017, 'Cốc giữ lạnh cafe Elmich sơn tĩnh điện chống vân tay', 100, 250000.00, 199000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CỐC GIỮ LẠNH CAFE ELMICH SƠN TĨNH ĐIỆN CHỐNG VÂN TAY ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Cốc giữ lạnh cafe Elmich sơn tĩnh điện chống vân tay là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'coc-giu-lanh-cafe-elmich-son-tinh-dien-chong-van-tay'),
(6018, 'Bình nước giữ nhiệt trẻ em Elmich họa tiết vui nhộn', 100, 189000.00, 150000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH NƯỚC GIỮ NHIỆT TRẺ EM ELMICH HỌA TIẾT VUI NHỘN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bình nước giữ nhiệt trẻ em Elmich họa tiết vui nhộn là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'binh-nuoc-giu-nhiet-tre-em-elmich-hoa-tiet-vui-nhon'),
(6019, 'Phích giữ nhiệt gia đình Elmich bơm tay dung tích 2.5L', 100, 650000.00, 520000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC PHÍCH GIỮ NHIỆT GIA ĐÌNH ELMICH BƠM TAY DUNG TÍCH 2.5L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Phích giữ nhiệt gia đình Elmich bơm tay dung tích 2.5L là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'phich-giu-nhiet-gia-dinh-elmich-bom-tay-dung-tich-25l'),
(6020, 'Bình giữ nhiệt thể thao chạy bộ Elmich quai xách 800ml', 100, 480000.00, 350000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH GIỮ NHIỆT THỂ THAO CHẠY BỘ ELMICH QUAI XÁCH 800ML ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bình giữ nhiệt thể thao chạy bộ Elmich quai xách 800ml là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'binh-giu-nhiet-the-thao-chay-bo-elmich-quai-xach-800ml'),
(6021, 'Cốc giữ nhiệt văn phòng Elmich nắp gạt chống tràn 450', 100, 300000.00, 220000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CỐC GIỮ NHIỆT VĂN PHÒNG ELMICH NẮP GẠT CHỐNG TRÀN 450 ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Cốc giữ nhiệt văn phòng Elmich nắp gạt chống tràn 450 là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'coc-giu-nhiet-van-phong-elmich-nap-gat-chong-tran-450'),
(6022, 'Bình thủy chứa nước pha trà Elmich cách nhiệt chân không', 100, 590000.00, 450000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH THỦY CHỨA NƯỚC PHA TRÀ ELMICH CÁCH NHIỆT CHÂN KHÔNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bình thủy chứa nước pha trà Elmich cách nhiệt chân không là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'binh-thuy-chua-nuoc-pha-tra-elmich-cach-nhiet-chan-khong'),
(6023, 'Bình ủ cháo giữ nóng Elmich đa tầng kèm chia vòng 1L', 100, 450000.00, 380000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH Ủ CHÁO GIỮ NÓNG ELMICH ĐA TẦNG KÈM CHIA VÒNG 1L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bình ủ cháo giữ nóng Elmich đa tầng kèm chia vòng 1L là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'binh-u-chao-giu-nong-elmich-da-tang-kem-chia-vong-1l'),
(6024, 'Ly giữ nhiệt đi xe hơi Elmich nhỏ gọn cắm đế vát 600ml', 100, 290000.00, 210000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC LY GIỮ NHIỆT ĐI XE HƠI ELMICH NHỎ GỌN CẮM ĐẾ VÁT 600ML ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Ly giữ nhiệt đi xe hơi Elmich nhỏ gọn cắm đế vát 600ml là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'ly-giu-nhiet-di-xe-hoi-elmich-nho-gon-cam-de-vat-600ml'),
(6025, 'Bình giữ nhiệt văn phòng Elmich màu pastel Vintage 500', 100, 320000.00, 280000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH GIỮ NHIỆT VĂN PHÒNG ELMICH MÀU PASTEL VINTAGE 500 ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bình giữ nhiệt văn phòng Elmich màu pastel Vintage 500 là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 2, NULL, '2026-03-29 14:03:30', 'binh-giu-nhiet-van-phong-elmich-mau-pastel-vintage-500'),
(6026, 'Nồi cơm điện cao tần IH Elmich lòng niêu 3D 1.8L', 100, 3200000.00, 2800000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM ĐIỆN CAO TẦN IH ELMICH LÒNG NIÊU 3D 1.8L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm điện cao tần IH Elmich lòng niêu 3D 1.8L, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-dien-cao-tan-ih-elmich-long-nieu-3d-18l'),
(6027, 'Nồi cơm điện tử nắp gài Elmich chống dính Binchotan', 100, 1590000.00, 1250000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM ĐIỆN TỬ NẮP GÀI ELMICH CHỐNG DÍNH BINCHOTAN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm điện tử nắp gài Elmich chống dính Binchotan, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-dien-tu-nap-gai-elmich-chong-dinh-binchotan'),
(6028, 'Nồi cơm điện mini Elmich cho sinh viên gia đình nhỏ 1L', 100, 550000.00, 450000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM ĐIỆN MINI ELMICH CHO SINH VIÊN GIA ĐÌNH NHỎ 1L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm điện mini Elmich cho sinh viên gia đình nhỏ 1L, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-dien-mini-elmich-cho-sinh-vien-gia-dinh-nho-1l'),
(6029, 'Nồi cơm điện cơ truyền thống Elmich đáy tổ ong siêu bền', 100, 690000.00, 550000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM ĐIỆN CƠ TRUYỀN THỐNG ELMICH ĐÁY TỔ ONG SIÊU BỀN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm điện cơ truyền thống Elmich đáy tổ ong siêu bền, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-dien-co-truyen-thong-elmich-day-to-ong-sieu-ben'),
(6030, 'Nồi cơm đa năng áp suất Elmich hầm và nấu siêu tốc', 100, 2250000.00, 1950000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM ĐA NĂNG ÁP SUẤT ELMICH HẦM VÀ NẤU SIÊU TỐC ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm đa năng áp suất Elmich hầm và nấu siêu tốc, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-da-nang-ap-suat-elmich-ham-va-nau-sieu-toc'),
(6031, 'Nồi cơm thông minh Elmich điều khiển Wi-Fi mâm nhiệt kép', 100, 4200000.00, 3500000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM THÔNG MINH ELMICH ĐIỀU KHIỂN WI-FI MÂM NHIỆT KÉP ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm thông minh Elmich điều khiển Wi-Fi mâm nhiệt kép, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-thong-minh-elmich-dieu-khien-wi-fi-mam-nhiet-kep'),
(6032, 'Nồi cơm tách đường Elmich giảm lượng carb dành cho ăn kiêng', 100, 2850000.00, 2450000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CƠM TÁCH ĐƯỜNG ELMICH GIẢM LƯỢNG CARB DÀNH CHO ĂN KIÊNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi cơm tách đường Elmich giảm lượng carb dành cho ăn kiêng, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 35, NULL, '2026-03-29 14:03:30', 'noi-com-tach-duong-elmich-giam-luong-carb-danh-cho-an-kieng'),
(6033, 'Nồi chiên không dầu điện tử Elmich cửa kính xoay 7L', 100, 2450000.00, 1990000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CHIÊN KHÔNG DẦU ĐIỆN TỬ ELMICH CỬA KÍNH XOAY 7L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi chiên không dầu điện tử Elmich cửa kính xoay 7L, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'noi-chien-khong-dau-dien-tu-elmich-cua-kinh-xoay-7l'),
(6034, 'Lò chiên kiêm nướng cơ phân tầng Elmich chân không 12L', 100, 3100000.00, 2650000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC LÒ CHIÊN KIÊM NƯỚNG CƠ PHÂN TẦNG ELMICH CHÂN KHÔNG 12L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Lò chiên kiêm nướng cơ phân tầng Elmich chân không 12L, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'lo-chien-kiem-nuong-co-phan-tang-elmich-chan-khong-12l');
INSERT INTO `product` (`ProductID`, `ProductName`, `Quantity`, `Price`, `SalePrice`, `Description`, `CategoryID`, `DiscountID`, `CreatedDate`, `Slug`) VALUES
(6035, 'Nồi chiên không dầu vặn cơ Elmich rổ đôi tháo rời 5L', 100, 1590000.00, 1250000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CHIÊN KHÔNG DẦU VẶN CƠ ELMICH RỔ ĐÔI THÁO RỜI 5L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi chiên không dầu vặn cơ Elmich rổ đôi tháo rời 5L, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'noi-chien-khong-dau-van-co-elmich-ro-doi-thao-roi-5l'),
(6036, 'Nồi nướng đối lưu khí nóng Elmich khoang Inox sáng', 100, 2150000.00, 1800000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI NƯỚNG ĐỐI LƯU KHÍ NÓNG ELMICH KHOANG INOX SÁNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi nướng đối lưu khí nóng Elmich khoang Inox sáng, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'noi-nuong-doi-luu-khi-nong-elmich-khoang-inox-sang'),
(6037, 'Lò nướng điện chuyên dụng Elmich quay gà xiên xoay', 100, 1890000.00, 1550000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC LÒ NƯỚNG ĐIỆN CHUYÊN DỤNG ELMICH QUAY GÀ XIÊN XOAY ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Lò nướng điện chuyên dụng Elmich quay gà xiên xoay, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'lo-nuong-dien-chuyen-dung-elmich-quay-ga-xien-xoay'),
(6038, 'Nồi chiên hơi nước siêu nhiệt Elmich tích hợp Steam 8L', 100, 4500000.00, 3800000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CHIÊN HƠI NƯỚC SIÊU NHIỆT ELMICH TÍCH HỢP STEAM 8L ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi chiên hơi nước siêu nhiệt Elmich tích hợp Steam 8L, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'noi-chien-hoi-nuoc-sieu-nhiet-elmich-tich-hop-steam-8l'),
(6039, 'Nồi chiên không dầu Elmich nắp kéo mặt phẳng LED viền', 100, 2600000.00, 2100000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC NỒI CHIÊN KHÔNG DẦU ELMICH NẮP KÉO MẶT PHẲNG LED VIỀN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Với Nồi chiên không dầu Elmich nắp kéo mặt phẳng LED viền, giờ đây bạn có thể thoải mái chiên xào hầm ninh mà không lắng lo một chút cặn bẩn dư lượng kim loại bào mòn. Lòng mặt nồi chảo sáng loáng bao bọc mọi lớp dầu nhiệt bùng nổ, đảm bảo thức ăn chín xuyên tận lõi, giữ cực mọng dưỡng chất thuần khiết bên trong.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Sức chịu đựng đáng kinh ngạc dưới ngọn lửa 500 độ C mà tuyệt đối không xuất hiện vết cháy nhọ ở lớp vỏ gầm, mặt men cứng cáp chống trầy đỉnh cao. Không một giọt PFOA hay PTFE nào được phép giải phóng vào không gian phòng bếp nhà bạn.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Tương thích bắt dính hít 100% tiết diện lòng đáy trên mọi dòng bếp điện từ cực khó tính, giảm thời gian tiêu hao lãng phí nhiệt lượng. Quai nhấc đập đinh tán tản bức xạ bảo vệ ngón tay bạn thoát khỏi tai nạn bị bỏng giật mình.\"}]', 32, NULL, '2026-03-29 14:03:30', 'noi-chien-khong-dau-elmich-nap-keo-mat-phang-led-vien'),
(6040, 'Máy xay sinh tố cối thủy tinh Elmich 4 lưỡi răng cưa', 100, 890000.00, 750000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC MÁY XAY SINH TỐ CỐI THỦY TINH ELMICH 4 LƯỠI RĂNG CƯA ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Máy xay sinh tố cối thủy tinh Elmich 4 lưỡi răng cưa. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 31, NULL, '2026-03-29 14:03:30', 'may-xay-sinh-to-coi-thuy-tinh-elmich-4-luoi-rang-cua'),
(6041, 'Máy xay cầm tay đa năng Elmich Inox kèm cối băm thịt', 100, 1250000.00, 990000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC MÁY XAY CẦM TAY ĐA NĂNG ELMICH INOX KÈM CỐI BĂM THỊT ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Máy xay cầm tay đa năng Elmich Inox kèm cối băm thịt. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 31, NULL, '2026-03-29 14:03:30', 'may-xay-cam-tay-da-nang-elmich-inox-kem-coi-bam-thit'),
(6042, 'Máy xay hạt khô mini Elmich siêu tốc độ chống ồn', 100, 450000.00, 390000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC MÁY XAY HẠT KHÔ MINI ELMICH SIÊU TỐC ĐỘ CHỐNG ỒN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Máy xay hạt khô mini Elmich siêu tốc độ chống ồn. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 31, NULL, '2026-03-29 14:03:30', 'may-xay-hat-kho-mini-elmich-sieu-toc-do-chong-on'),
(6043, 'Máy ép trái cây mâm xoay lưới lọc siêu mịn Elmich ly tâm', 100, 1500000.00, 1200000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC MÁY ÉP TRÁI CÂY MÂM XOAY LƯỚI LỌC SIÊU MỊN ELMICH LY TÂM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Máy ép trái cây mâm xoay lưới lọc siêu mịn Elmich ly tâm. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 31, NULL, '2026-03-29 14:03:30', 'may-ep-trai-cay-mam-xoay-luoi-loc-sieu-min-elmich-ly-tam'),
(6044, 'Máy ép chậm nguyên quả Elmich giữ dứt 98% vitamin c', 100, 2500000.00, 1950000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC MÁY ÉP CHẬM NGUYÊN QUẢ ELMICH GIỮ DỨT 98% VITAMIN C ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Máy ép chậm nguyên quả Elmich giữ dứt 98% vitamin c. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 31, NULL, '2026-03-29 14:03:30', 'may-ep-cham-nguyen-qua-elmich-giu-dut-98-vitamin-c'),
(6045, 'Máy làm sữa hạt Elmich chống ồn vòng đệm chân không', 100, 3250000.00, 2850000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC MÁY LÀM SỮA HẠT ELMICH CHỐNG ỒN VÒNG ĐỆM CHÂN KHÔNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Máy làm sữa hạt Elmich chống ồn vòng đệm chân không. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 31, NULL, '2026-03-29 14:03:30', 'may-lam-sua-hat-elmich-chong-on-vong-dem-chan-khong'),
(6046, 'Ấm siêu tốc thủy tinh Elmich kèm dải LED đổi 7 màu', 100, 550000.00, 450000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC ẤM SIÊU TỐC THỦY TINH ELMICH KÈM DẢI LED ĐỔI 7 MÀU ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Ấm siêu tốc thủy tinh Elmich kèm dải LED đổi 7 màu. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 33, NULL, '2026-03-29 14:03:30', 'am-sieu-toc-thuy-tinh-elmich-kem-dai-led-doi-7-mau'),
(6047, 'Bình đun siêu tốc Inox Elmich đun nhanh 2200W vòi to', 100, 350000.00, 280000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH ĐUN SIÊU TỐC INOX ELMICH ĐUN NHANH 2200W VÒI TO ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Bình đun siêu tốc Inox Elmich đun nhanh 2200W vòi to. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 33, NULL, '2026-03-29 14:03:30', 'binh-dun-sieu-toc-inox-elmich-dun-nhanh-2200w-voi-to'),
(6048, 'Ấm siêu tốc cách nhiệt 2 lớp Elmich chống bỏng vỏ nhám', 100, 490000.00, 390000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC ẤM SIÊU TỐC CÁCH NHIỆT 2 LỚP ELMICH CHỐNG BỎNG VỎ NHÁM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Ấm siêu tốc cách nhiệt 2 lớp Elmich chống bỏng vỏ nhám. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 33, NULL, '2026-03-29 14:03:30', 'am-sieu-toc-cach-nhiet-2-lop-elmich-chong-bong-vo-nham'),
(6049, 'Bình siêu tốc cảm ứng nhiệt Elmich cài đặt độ sôi pha sữa', 100, 890000.00, 750000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BÌNH SIÊU TỐC CẢM ỨNG NHIỆT ELMICH CÀI ĐẶT ĐỘ SÔI PHA SỮA ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Bình siêu tốc cảm ứng nhiệt Elmich cài đặt độ sôi pha sữa. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 33, NULL, '2026-03-29 14:03:30', 'binh-sieu-toc-cam-ung-nhiet-elmich-cai-dat-do-soi-pha-sua'),
(6050, 'Ấm đun nước siêu tốc cổ ngỗng Elmich chuyên đổ cà phê', 100, 1050000.00, 850000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC ẤM ĐUN NƯỚC SIÊU TỐC CỔ NGỖNG ELMICH CHUYÊN ĐỔ CÀ PHÊ ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Ấm đun nước siêu tốc cổ ngỗng Elmich chuyên đổ cà phê. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 33, NULL, '2026-03-29 14:03:30', 'am-dun-nuoc-sieu-toc-co-ngong-elmich-chuyen-do-ca-phe'),
(6051, 'Ấm đun du lịch mini Elmich gấp lồng silicon thu gọn', 100, 650000.00, 550000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC ẤM ĐUN DU LỊCH MINI ELMICH GẤP LỒNG SILICON THU GỌN ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Trải nghiệm nền công nghệ 4.0 số hóa AI ngay trên thao tác nhấn phím của Ấm đun du lịch mini Elmich gấp lồng silicon thu gọn. Sức mạnh motor dây đồng luân nhịp tạo tốc vòi xoáy cực khủng khiếp băm xay đảo tung các khóm nguyên liệu khó nhằn cực dứt khoát nhanh trí.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Loại trừ vĩnh viễn thói cực nhọc canh chừng nhờ Role nhiệt tự động đứt lẫy công tắc khi đạt đỉnh tải, phòng ngừa chập xì hỏa hoạn. An toa toàn trật tự kỉ luật cực khắt khe cho môi trường dính nhiều dòng nước ở nhà bếp.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Giao diện trực quan màn hình nháy rõ chói lóa báo dung lượng. Nhựa vách cấu thành khoác cho mình lớp ABS siêu thân thiện chịu va đập đun nấu độ lốc không phai vàng nhòe nứt mặt hiển thị điện tử.\"}]', 33, NULL, '2026-03-29 14:03:30', 'am-dun-du-lich-mini-elmich-gap-long-silicon-thu-gon'),
(6052, 'Bộ 3 hộp Inox 304 Elmich bảo quản thịt cá tươi nắp dẻo', 100, 450000.00, 380000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ 3 HỘP INOX 304 ELMICH BẢO QUẢN THỊT CÁ TƯƠI NẮP DẺO ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bộ 3 hộp Inox 304 Elmich bảo quản thịt cá tươi nắp dẻo là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'bo-3-hop-inox-304-elmich-bao-quan-thit-ca-tuoi-nap-deo'),
(6053, 'Hộp thực phẩm Inox đáy cạn Elmich chống lây hôi tủ lạnh', 100, 180000.00, 150000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC HỘP THỰC PHẨM INOX ĐÁY CẠN ELMICH CHỐNG LÂY HÔI TỦ LẠNH ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Hộp thực phẩm Inox đáy cạn Elmich chống lây hôi tủ lạnh là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'hop-thuc-pham-inox-day-can-elmich-chong-lay-hoi-tu-lanh'),
(6054, 'Khay hộp cơm văn phòng Inox Elmich kèm nắp kín 1 chiều', 100, 250000.00, 199000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC KHAY HỘP CƠM VĂN PHÒNG INOX ELMICH KÈM NẮP KÍN 1 CHIỀU ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Khay hộp cơm văn phòng Inox Elmich kèm nắp kín 1 chiều là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'khay-hop-com-van-phong-inox-elmich-kem-nap-kin-1-chieu'),
(6055, 'Bộ 2 hộp thép chống rỉ Elmich chốt sập vách cao', 100, 320000.00, 280000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ 2 HỘP THÉP CHỐNG RỈ ELMICH CHỐT SẬP VÁCH CAO ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bộ 2 hộp thép chống rỉ Elmich chốt sập vách cao là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'bo-2-hop-thep-chong-ri-elmich-chot-sap-vach-cao'),
(6056, 'Hộp Inox sâu lòng Elmich đậy bọc hút chân không', 100, 280000.00, 240000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC HỘP INOX SÂU LÒNG ELMICH ĐẬY BỌC HÚT CHÂN KHÔNG ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Hộp Inox sâu lòng Elmich đậy bọc hút chân không là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'hop-inox-sau-long-elmich-day-boc-hut-chan-khong'),
(6057, 'Cặp lồng Inox đa tầng Elmich chống xì đổ nước cánh nhíp', 100, 450000.00, 350000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC CẶP LỒNG INOX ĐA TẦNG ELMICH CHỐNG XÌ ĐỔ NƯỚC CÁNH NHÍP ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Cặp lồng Inox đa tầng Elmich chống xì đổ nước cánh nhíp là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'cap-long-inox-da-tang-elmich-chong-xi-do-nuoc-canh-nhip'),
(6058, 'Bộ khay đũa thìa dĩa dã ngoại Inox Elmich có túi xách', 100, 190000.00, 150000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC BỘ KHAY ĐŨA THÌA DĨA DÃ NGOẠI INOX ELMICH CÓ TÚI XÁCH ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Bộ khay đũa thìa dĩa dã ngoại Inox Elmich có túi xách là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'bo-khay-dua-thia-dia-da-ngoai-inox-elmich-co-tui-xach'),
(6059, 'Thố trộn bột khuấy thịt hầm Inox Elmich mặt nhẵn 22cm', 100, 350000.00, 290000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC THỐ TRỘN BỘT KHUẤY THỊT HẦM INOX ELMICH MẶT NHẴN 22CM ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Thố trộn bột khuấy thịt hầm Inox Elmich mặt nhẵn 22cm là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'tho-tron-bot-khuay-thit-ham-inox-elmich-mat-nhan-22cm'),
(6060, 'Rổ bát màng lưới Inox thoát nước Elmich 2 tầng kép', 100, 320000.00, 260000.00, '[{\"type\":\"title\",\"text\":\"TUYỆT TÁC RỔ BÁT MÀNG LƯỚI INOX THOÁT NƯỚC ELMICH 2 TẦNG KÉP ĐẾN TỪ CHÂU ÂU\"},{\"type\":\"text\",\"text\":\"Sở hữu Rổ bát màng lưới Inox thoát nước Elmich 2 tầng kép là sở hữu vách tường bảo vệ đa tầng chân không, khảng định một lần nữa đế chế bảo quản thức ăn siêu vô địch. Từ luồng nhiệt nước sôi ùng ục cho đến sự buốt giá của đá đông, hộp bình cam đoan khóa chặt 100% nền nhiệt trong ít nhất 8 tiếng đồng hồ.\"},{\"type\":\"title\",\"text\":\"AN TOÀN TUYỆT ĐỐI CHO SỨC KHỎE CỦA CẢ GIA ĐÌNH\"},{\"type\":\"text\",\"text\":\"Vỏ hợp kim inox thép nguyên khối dập vát cực kì tinh tế bằng thủ công bo 4 góc vòng, đánh tan 100% tỷ lệ hở ron rò nước khi quăng quật lắc mạnh bên trong chiếc túi xách, cốp xe trên mỗi dặm đường xóc đá.\"},{\"type\":\"title\",\"text\":\"LAU CHÙI CỰC KÌ DỄ DÀNG SAU MỖI BỮA ĂN\"},{\"type\":\"text\",\"text\":\"Cấu tạo miệng loe khoét trơn thuận tiện trong thao tác thả cọ búi rửa lau đúc tay vào làm vệ sinh sạch sẽ, chống đóng cặn rêu váng vô cùng vệ sinh an tâm dùng pha trà cafe nóng sữa đêm ngày.\"}]', 9, NULL, '2026-03-29 14:03:30', 'ro-bat-mang-luoi-inox-thoat-nuoc-elmich-2-tang-kep'),
(6061, 'nồi', 999, 99.00, NULL, '[]', 42, 3, '2026-04-03 03:01:57', 'noi');

-- --------------------------------------------------------

--
-- Table structure for table `productimage`
--

CREATE TABLE `productimage` (
  `ProductImageID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `ImagePath` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `productimage`
--

INSERT INTO `productimage` (`ProductImageID`, `ProductID`, `ImagePath`) VALUES
(6, 2, 'uploads/product/2/1772630143944-774070700.jpg'),
(7, 3, 'uploads/product/3/1772630226988-600163609.webp'),
(20, 1, 'uploads/product/1/1774280015969-581002924.webp'),
(22, 13, 'uploads/product/13/1774760909474-784595464.webp'),
(23, 14, 'uploads/product/14/2355989pt-05-e99beb70-bffc-4f99-b794-4a513451e64e-1774761749199-0.webp'),
(24, 14, 'uploads/product/14/2355989pt-03-bee2e5e9-b617-43a9-9244-5025b4bdf517-1774761749200-1.webp'),
(25, 14, 'uploads/product/14/2355989pt-02-b1bf19fa-f7ef-40ef-a461-4d5d99b01ec5-1774761749200-2.webp'),
(26, 14, 'uploads/product/14/2355989pt-01-733e7742-65b5-4743-8ea5-0af1a6b65880-1774761749201-3.webp'),
(30, 15, 'uploads/product/15/1774763902198-322731020.webp'),
(31, 15, 'uploads/product/15/1774763902204-801831043.webp'),
(32, 15, 'uploads/product/15/1774763902209-842193756.webp'),
(33, 16, 'uploads/product/16/el-5529be18-3-1774764071907-0.webp'),
(34, 16, 'uploads/product/16/el-5529be18-6-1774764071907-1.webp'),
(35, 16, 'uploads/product/16/el-5529be18-1-1774764071907-2.webp'),
(36, 17, 'uploads/product/17/el5538sk28-web-1000x1000-3-5f755d41-c368-4bc8-9d0d-c5f68af128e7-1774764238423-0.webp'),
(37, 17, 'uploads/product/17/el5538sk28-web-1000x1000-4-3d04a444-9000-4359-9213-811e367b751f-1774764238424-1.webp'),
(38, 17, 'uploads/product/17/el5538sk28-web-1000x1000-1-463f5c3b-9f5a-41aa-92c8-baba93d7fb8b-1774764238424-2.webp'),
(41, 6001, 'uploads/product/6001/1774767876576-236506612.jpg'),
(42, 6002, 'uploads/product/6002/1774768954420-541173278.webp'),
(43, 6003, 'uploads/product/6003/1774768998378-857736444.webp'),
(44, 6004, 'uploads/product/6004/1774769094212-855045026.webp'),
(45, 6005, 'uploads/product/6005/1774769121209-60825832.jpg'),
(46, 6006, 'uploads/product/6006/1774769196407-747398903.webp'),
(47, 6007, 'uploads/product/6007/1774769225190-441417188.webp'),
(48, 6060, 'uploads/product/6060/1774769272095-570654435.webp'),
(49, 6059, 'uploads/product/6059/1774769298922-337724293.webp'),
(50, 6058, 'uploads/product/6058/1774769343274-939644481.webp'),
(51, 6057, 'uploads/product/6057/1774769372824-414702392.webp'),
(52, 6025, 'uploads/product/6025/1774769624334-69794481.webp'),
(53, 6024, 'uploads/product/6024/1774769665414-192570244.webp'),
(54, 6023, 'uploads/product/6023/1774769711442-688428827.webp'),
(55, 6022, 'uploads/product/6022/1774769764109-420404067.webp'),
(56, 6021, 'uploads/product/6021/1774769814634-180218930.webp'),
(57, 6020, 'uploads/product/6020/1774769857979-384662527.webp'),
(58, 6019, 'uploads/product/6019/1774769938996-398649593.jpg'),
(59, 6018, 'uploads/product/6018/1774769991093-830380656.webp'),
(60, 6016, 'uploads/product/6016/1774770066438-58739750.webp'),
(61, 6017, 'uploads/product/6017/1774770138932-961424610.jpg'),
(62, 6013, 'uploads/product/6013/1774770209124-492903176.webp'),
(63, 6015, 'uploads/product/6015/1774770251054-940439400.jpg'),
(64, 6014, 'uploads/product/6014/1774770462652-947245656.jpg'),
(65, 6012, 'uploads/product/6012/1774770505979-144672412.webp'),
(66, 6011, 'uploads/product/6011/1774770551395-489247521.jpg'),
(67, 6010, 'uploads/product/6010/1774770601237-677502270.jpg'),
(68, 6009, 'uploads/product/6009/1774770638172-70815654.webp'),
(69, 6008, 'uploads/product/6008/1774770671580-477752539.webp'),
(70, 6061, 'uploads/product/6061/1774770209124-492903176-1775185317708-0.webp');

-- --------------------------------------------------------

--
-- Table structure for table `purchaseinvoice`
--

CREATE TABLE `purchaseinvoice` (
  `InvoiceID` int(11) NOT NULL,
  `EntryDate` datetime DEFAULT current_timestamp(),
  `TotalAmount` decimal(15,2) DEFAULT NULL,
  `SupplierID` int(11) DEFAULT NULL,
  `PaymentMethod` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchaseinvoicedetail`
--

CREATE TABLE `purchaseinvoicedetail` (
  `DetailID` int(11) NOT NULL,
  `InvoiceID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `UnitPrice` decimal(15,2) DEFAULT NULL,
  `TotalPrice` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salesinvoice`
--

CREATE TABLE `salesinvoice` (
  `SalesInvoiceID` int(11) NOT NULL,
  `EntryDate` datetime DEFAULT current_timestamp(),
  `TotalAmount` decimal(15,2) DEFAULT NULL,
  `AccountID` int(11) DEFAULT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `PaymentMethod` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salesinvoice`
--

INSERT INTO `salesinvoice` (`SalesInvoiceID`, `EntryDate`, `TotalAmount`, `AccountID`, `Address`, `PaymentMethod`, `Status`) VALUES
(1, '2026-03-23 10:00:00', 200000.00, 1, 'HCM', 'COD', 'pending'),
(2, '2026-03-29 03:36:30', 379500.00, 5, 'fcvhjhjbbh, Xã Sơn Vi, Huyện Lâm Thao, Tỉnh Phú Thọ', 'COD', 'pending'),
(3, '2026-03-29 04:01:24', 519000.00, 5, '1123e, Xã Hoàng Xá, Huyện Thanh Thuỷ, Tỉnh Phú Thọ', 'COD', 'done'),
(4, '2026-04-03 02:58:58', 1360000.00, 5, 'hfddff, Xã Hòa Lạc, Huyện Hữu Lũng, Tỉnh Lạng Sơn', 'COD', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `salesinvoicedetails`
--

CREATE TABLE `salesinvoicedetails` (
  `DetailID` int(11) NOT NULL,
  `SalesInvoiceID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `UnitPrice` decimal(15,2) DEFAULT NULL,
  `TotalPrice` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `salesinvoicedetails`
--

INSERT INTO `salesinvoicedetails` (`DetailID`, `SalesInvoiceID`, `ProductID`, `Quantity`, `UnitPrice`, `TotalPrice`) VALUES
(1, 1, 2, 1, 100000.00, 100000.00),
(2, 1, 3, 1, 100000.00, 100000.00),
(3, 2, 1, 1, 259500.00, 259500.00),
(4, 2, 2, 1, 120000.00, 120000.00),
(6, 4, 6022, 1, 590000.00, 590000.00),
(7, 4, 6023, 1, 450000.00, 450000.00),
(8, 4, 6025, 1, 320000.00, 320000.00);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `SupplierID` int(11) NOT NULL,
  `SupplierName` varchar(255) NOT NULL,
  `Address` varchar(500) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`AccountID`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Indexes for table `discount`
--
ALTER TABLE `discount`
  ADD PRIMARY KEY (`DiscountID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `CategoryID` (`CategoryID`),
  ADD KEY `DiscountID` (`DiscountID`);

--
-- Indexes for table `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`ProductImageID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `purchaseinvoice`
--
ALTER TABLE `purchaseinvoice`
  ADD PRIMARY KEY (`InvoiceID`),
  ADD KEY `SupplierID` (`SupplierID`);

--
-- Indexes for table `purchaseinvoicedetail`
--
ALTER TABLE `purchaseinvoicedetail`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `InvoiceID` (`InvoiceID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `salesinvoice`
--
ALTER TABLE `salesinvoice`
  ADD PRIMARY KEY (`SalesInvoiceID`),
  ADD KEY `AccountID` (`AccountID`);

--
-- Indexes for table `salesinvoicedetails`
--
ALTER TABLE `salesinvoicedetails`
  ADD PRIMARY KEY (`DetailID`),
  ADD KEY `SalesInvoiceID` (`SalesInvoiceID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`SupplierID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `AccountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `discount`
--
ALTER TABLE `discount`
  MODIFY `DiscountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6062;

--
-- AUTO_INCREMENT for table `productimage`
--
ALTER TABLE `productimage`
  MODIFY `ProductImageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `purchaseinvoice`
--
ALTER TABLE `purchaseinvoice`
  MODIFY `InvoiceID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchaseinvoicedetail`
--
ALTER TABLE `purchaseinvoicedetail`
  MODIFY `DetailID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salesinvoice`
--
ALTER TABLE `salesinvoice`
  MODIFY `SalesInvoiceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `salesinvoicedetails`
--
ALTER TABLE `salesinvoicedetails`
  MODIFY `DetailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `SupplierID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `category` (`CategoryID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`DiscountID`) REFERENCES `discount` (`DiscountID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `productimage_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `purchaseinvoice`
--
ALTER TABLE `purchaseinvoice`
  ADD CONSTRAINT `purchaseinvoice_ibfk_1` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`SupplierID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `purchaseinvoicedetail`
--
ALTER TABLE `purchaseinvoicedetail`
  ADD CONSTRAINT `purchaseinvoicedetail_ibfk_1` FOREIGN KEY (`InvoiceID`) REFERENCES `purchaseinvoice` (`InvoiceID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `purchaseinvoicedetail_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `salesinvoice`
--
ALTER TABLE `salesinvoice`
  ADD CONSTRAINT `salesinvoice_ibfk_1` FOREIGN KEY (`AccountID`) REFERENCES `account` (`AccountID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `salesinvoicedetails`
--
ALTER TABLE `salesinvoicedetails`
  ADD CONSTRAINT `salesinvoicedetails_ibfk_1` FOREIGN KEY (`SalesInvoiceID`) REFERENCES `salesinvoice` (`SalesInvoiceID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `salesinvoicedetails_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
