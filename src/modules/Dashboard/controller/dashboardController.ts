// Import các controller và model cần thiết
import { benhNhanNoiTruController } from '../../BenhNhanNoiTru/controller/benhNhanNoiTruController';
import { hoSoBenhAnController } from '../../MedicalRecords/controller/medicalRecordController';
import { yLenhController } from '../../PhacDoYLenh/controller/yLenhController';
import { BenhNhanNoiTru } from '../../BenhNhanNoiTru/model/benhNhanNoiTruModel';
import { YLenh } from '../../PhacDoYLenh/model/yLenhModel';

// Định nghĩa cấu trúc dữ liệu trả về cho Dashboard
export interface DashboardStats {
  soBenhNhanNoiTru: number;
  soHoSoBenhAn: number;
  soYLenh: number;
  yLenhGanDay: YLenh[];
  benhNhanMoiNhapVien: BenhNhanNoiTru[];
}

export const dashboardController = {
  /**
   * 📊 Lấy tất cả dữ liệu thống kê cho trang Dashboard
   */
  async getDashboardData(): Promise<DashboardStats> {
    try {
      // Gọi nhiều API cùng lúc để tăng tốc độ bằng Promise.all
      const [
        danhSachBenhNhanNoiTru,
        danhSachHoSoBenhAn,
        danhSachYLenh,
      ] = await Promise.all([
        benhNhanNoiTruController.getAll(),
        hoSoBenhAnController.getAll(),
        yLenhController.getAll(),
      ]);

      // Sắp xếp danh sách để lấy các mục gần đây nhất
      const yLenhDaSapXep = [...danhSachYLenh].sort((a, b) => new Date(b.ngayGio).getTime() - new Date(a.ngayGio).getTime());
      const benhNhanDaSapXep = [...danhSachBenhNhanNoiTru].sort((a, b) => new Date(b.ngayNhapVien).getTime() - new Date(a.ngayNhapVien).getTime());

      // Trả về đối tượng dữ liệu đã được xử lý
      return {
        soBenhNhanNoiTru: danhSachBenhNhanNoiTru.length,
        soHoSoBenhAn: danhSachHoSoBenhAn.length,
        soYLenh: danhSachYLenh.length,
        yLenhGanDay: yLenhDaSapXep.slice(0, 5), // Lấy 5 y lệnh mới nhất
        benhNhanMoiNhapVien: benhNhanDaSapXep.slice(0, 5), // Lấy 5 bệnh nhân mới nhất
      };
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu cho Dashboard:", error);
      // Trả về giá trị mặc định nếu có lỗi
      return {
        soBenhNhanNoiTru: 0,
        soHoSoBenhAn: 0,
        soYLenh: 0,
        yLenhGanDay: [],
        benhNhanMoiNhapVien: [],
      };
    }
  },
};