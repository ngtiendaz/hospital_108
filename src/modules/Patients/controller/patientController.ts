import { BenhNhan } from '../model/patientModel';
// ✅ Thêm import controller của bệnh nhân nội trú
import { benhNhanNoiTruController } from '../../BenhNhanNoiTru/controller/benhNhanNoiTruController'; // Điều chỉnh đường dẫn nếu cần

const BASE_URL = 'http://localhost:3000/';
const API = BASE_URL + 'api/v1/benhnhan';
const API_NHAPVIEN = BASE_URL + 'api/v1/nhapvien';

export const patientController = {
  /**
   * ✅ Lấy danh sách bệnh nhân CHƯA NHẬP VIỆN.
   * Hàm này sẽ lọc ra những bệnh nhân không có trong danh sách nội trú.
   */
  async getAll(): Promise<BenhNhan[]> {
    try {
      // Bước 1: Lấy danh sách ID của TẤT CẢ bệnh nhân đang nội trú (dùng hàm raw để không bị lọc)
      const allInpatients = await benhNhanNoiTruController.getAllRaw();
      const inpatientIds = new Set(allInpatients.map(p => p.maBenhNhan));

      // Bước 2: Lấy toàn bộ danh sách bệnh nhân từ hệ thống
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API danh sách bệnh nhân: ${res.status}`);
      
      const allPatients: BenhNhan[] = await res.json();

      // Bước 3: Lọc và chỉ trả về những bệnh nhân có ID không nằm trong danh sách nội trú
      const availablePatients = allPatients.filter(
        (patient) => !inpatientIds.has(patient.maBenhNhan)
      );

      console.log('✅ Đã lọc, danh sách bệnh nhân có thể nhập viện:', availablePatients.length);
      return availablePatients;
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách bệnh nhân có thể nhập viện:', err);
      return [];
    }
  },

  // ✅ Lấy chi tiết bệnh nhân theo ID (Không thay đổi)
  async getById(id: string): Promise<BenhNhan | null> {
    try {
      const res = await fetch(`${API}/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('❌ Lỗi khi lấy chi tiết bệnh nhân:', err);
      return null;
    }
  },

  // ✅ Thêm bệnh nhân nội trú (nhập viện) (Không thay đổi)
  async addInpatient(data: {
    maBenhNhan: string;
    ngayNhapVien: string;
    khoaDieuTri: string;
    phong: string;
    giuong: string;
    chuanDoan: string;
    maBacSi: string;
  }): Promise<boolean> {
    try {
      const res = await fetch(API_NHAPVIEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`Lỗi khi thêm bệnh nhân nội trú ${res.status}:`, errorBody);
        return false;
      }
      
      console.log('✅ Thêm bệnh nhân nội trú thành công');
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi thêm bệnh nhân nội trú:', err);
      return false;
    }
  },
};