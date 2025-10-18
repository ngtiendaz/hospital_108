import { XuatVien } from '../model/xuatVienModel'; // Đường dẫn tới model của bạn

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:3000/api/v1/xuatvien/';

// API để lấy danh sách bệnh nhân đã xuất viện
const API_GET_ALL = BASE_URL + 'danhsachxuatvien';

// API để thêm thông tin xuất viện mới
const API_ADD = BASE_URL + 'addxuatvien';

/**
 * Đối tượng chứa các phương thức tương tác với API liên quan đến xuất viện
 */
export const xuatVienController = {
  /**
   * 📋 Lấy danh sách tất cả các lần xuất viện.
   * @returns {Promise<XuatVien[]>} Một mảng các đối tượng XuatVien. Trả về mảng rỗng nếu có lỗi.
   */
  async getAll(): Promise<XuatVien[]> {
    try {
      // Dùng { cache: 'no-store' } để đảm bảo dữ liệu luôn mới nhất
      const res = await fetch(API_GET_ALL, { cache: 'no-store' });

      if (!res.ok) {
        throw new Error(`Lỗi khi gọi API: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      return data as XuatVien[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách xuất viện:', err);
      return []; // Trả về mảng rỗng để tránh lỗi ở phía giao diện
    }
  },

  /**
   * ➕ Thêm thông tin xuất viện mới cho một bệnh án.
   * Dữ liệu cần truyền vào khớp với yêu cầu trong ảnh Postman của bạn.
   * @param {object} data - Dữ liệu xuất viện mới.
   * @param {number} data.maBenhAn - Mã của bệnh án cần cho xuất viện.
   * @param {string} data.ngayRaVien - Ngày ra viện (định dạng YYYY-MM-DD).
   * @param {string} data.trangThai - Trạng thái lúc ra viện (ví dụ: "Đã xuất viện").
   * @param {string} data.ghiChu - Ghi chú thêm của bác sĩ.
   * @returns {Promise<boolean>} `true` nếu thêm thành công, `false` nếu thất bại.
   */
  async add(
    data: {
      maBenhAn: number;
      ngayRaVien: string;
      trangThai: string;
      ghiChu: string;
    }
  ): Promise<boolean> {
    try {
      const res = await fetch(API_ADD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Cố gắng đọc và hiển thị lỗi từ body của response để debug dễ hơn
        const errorBody = await res.text();
        console.error(`❌ Lỗi API khi thêm thông tin xuất viện ${res.status}:`, errorBody);
        return false;
      }
      
      console.log('✅ Thêm thông tin xuất viện thành công!');
      return true;
    } catch (err) {
      console.error('❌ Lỗi hệ thống khi thêm thông tin xuất viện:', err);
      return false;
    }
  },
};