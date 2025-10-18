// Import các controller và model cần thiết
import { benhNhanNoiTruController } from '../../BenhNhanNoiTru/controller/benhNhanNoiTruController';
import { hoSoBenhAnController } from '../../MedicalRecords/controller/medicalRecordController';
import { yLenhController } from '../../PhacDoYLenh/controller/yLenhController';
import { xuatVienController } from '../../XuatVien/controller/xuatVienController'; // ✨ Đã thêm

import { BenhNhanNoiTru } from '../../BenhNhanNoiTru/model/benhNhanNoiTruModel';
import { YLenh } from '../../PhacDoYLenh/model/yLenhModel';
import { XuatVien } from '../../XuatVien/model/xuatVienModel'; // ✨ Đã thêm

// ✨ THAY ĐỔI 1: Cập nhật cấu trúc dữ liệu trả về cho Dashboard
export interface DashboardStats {
  soBenhNhanNoiTru: number;
  soHoSoBenhAn: number;
  soYLenh: number;
  soBenhNhanXuatVien: number; // Thống kê mới
  yLenhGanDay: YLenh[];
  benhNhanMoiNhapVien: BenhNhanNoiTru[];
  benhNhanXuatVienGanDay: XuatVien[]; // Danh sách mới
}

export const dashboardController = {
  /**
   * 📊 Lấy tất cả dữ liệu thống kê cho trang Dashboard
   */
  async getDashboardData(): Promise<DashboardStats> {
    try {
      // ✨ THAY ĐỔI 2: Gọi thêm API của xuất viện vào Promise.all
      const [
        danhSachBenhNhanNoiTru,
        danhSachHoSoBenhAn,
        danhSachYLenh,
        danhSachXuatVien,
      ] = await Promise.all([
        benhNhanNoiTruController.getAll(),
        hoSoBenhAnController.getAll(),
        yLenhController.getAll(),
        xuatVienController.getAll(),
      ]);

      // Sắp xếp danh sách để lấy các mục gần đây nhất
      const yLenhDaSapXep = [...danhSachYLenh].sort((a, b) => new Date(b.ngayGio).getTime() - new Date(a.ngayGio).getTime());
      const benhNhanDaSapXep = [...danhSachBenhNhanNoiTru].sort((a, b) => new Date(b.ngayNhapVien).getTime() - new Date(a.ngayNhapVien).getTime());
      
      // ✨ THAY ĐỔI 3: Xử lý dữ liệu cho thống kê xuất viện
      const xuatVienDaSapXep = [...danhSachXuatVien].sort((a, b) => new Date(b.ngayRaVien).getTime() - new Date(a.ngayRaVien).getTime());

      // ✨ THAY ĐỔI 4: Trả về đối tượng dữ liệu đã được cập nhật
      return {
        soBenhNhanNoiTru: danhSachBenhNhanNoiTru.length,
        soHoSoBenhAn: danhSachHoSoBenhAn.length,
        soYLenh: danhSachYLenh.length,
        soBenhNhanXuatVien: danhSachXuatVien.length, // Dữ liệu mới
        yLenhGanDay: yLenhDaSapXep.slice(0, 5),
        benhNhanMoiNhapVien: benhNhanDaSapXep.slice(0, 5),
        benhNhanXuatVienGanDay: xuatVienDaSapXep.slice(0, 5), // Dữ liệu mới
      };
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu cho Dashboard:", error);
      // ✨ THAY ĐỔI 5: Cập nhật giá trị mặc định nếu có lỗi
      return {
        soBenhNhanNoiTru: 0,
        soHoSoBenhAn: 0,
        soYLenh: 0,
        soBenhNhanXuatVien: 0,
        yLenhGanDay: [],
        benhNhanMoiNhapVien: [],
        benhNhanXuatVienGanDay: [],
      };
    }
  },
};