import { TinhTrangSucKhoe } from '../model/tinhTrangModel';

const BASE_URL = 'http://localhost:3000/';
// API để lấy danh sách tình trạng sức khỏe theo mã bệnh án
const API_GET = BASE_URL + 'api/v1/tinhtrangbenh/'; 
// API để cập nhật (thêm mới) một tình trạng sức khỏe
const API_UPDATE = BASE_URL + 'api/v1/tinhtrangbenh/capnhattinhtrang';

export const tinhTrangSucKhoeController = {
  /**
   * 🩺 Lấy danh sách tình trạng sức khỏe của một bệnh án
   * @param maBenhAn Mã của bệnh án cần lấy thông tin
   * @returns Mảng các đối tượng TinhTrangSucKhoe
   */
  async getByMaBenhAn(maBenhAn: number): Promise<TinhTrangSucKhoe[]> {
    try {
      const res = await fetch(`${API_GET}${maBenhAn}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Lỗi khi gọi API lấy tình trạng sức khỏe: ${res.status}`);
      }
      const data = await res.json();
      return data as TinhTrangSucKhoe[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách tình trạng sức khỏe:', err);
      return [];
    }
  },

  /**
   * ➕ Cập nhật (thêm mới) tình trạng sức khỏe cho bệnh án
   * @param data Dữ liệu tình trạng sức khỏe mới
   * @returns boolean cho biết thành công hay thất bại
   */
  async update(
    data: {
      maBenhAn: number;
      ngay: string;
      tinhTrang: string;
      ghiChu: string;
    }
  ): Promise<boolean> {
    try {
      const res = await fetch(API_UPDATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Quan trọng: Body là JSON
        },
        body: JSON.stringify(data), // Chuyển đổi object thành chuỗi JSON
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`❌ Lỗi API khi cập nhật tình trạng sức khỏe ${res.status}:`, errorBody);
        return false;
      }
      console.log('✅ Cập nhật tình trạng sức khỏe thành công!');
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật tình trạng sức khỏe:', err);
      return false;
    }
  },
};