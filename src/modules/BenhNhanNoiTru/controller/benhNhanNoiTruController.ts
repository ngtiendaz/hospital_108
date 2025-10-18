import { BenhNhanNoiTru } from '../model/benhNhanNoiTruModel';
// ✅ Import controller của hồ sơ bệnh án để kiểm tra
import { hoSoBenhAnController } from '../../MedicalRecords/controller/medicalRecordController'; // Sửa đường dẫn nếu cần
import { APIs } from '../../../config/apiConfig';
const BASE_URL = APIs;
const API = BASE_URL + 'api/v1/nhapvien';

// Hàm helper để lấy toàn bộ danh sách bệnh nhân nội trú (chưa lọc)
const getAllRawInpatients = async (): Promise<BenhNhanNoiTru[]> => {
  try {
    const res = await fetch(API, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Lỗi khi gọi API danh sách nhập viện: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách nội trú (raw):', err);
    return [];
  }
};


export const benhNhanNoiTruController = {
  /**
   * 📘 Lấy danh sách bệnh nhân nội trú CHƯA CÓ hồ sơ bệnh án.
   * Hàm này sẽ lọc những bệnh nhân đã có hồ sơ ra khỏi danh sách.
   */
  async getAll(): Promise<BenhNhanNoiTru[]> {
    try {
      // Bước 1: Lấy danh sách mã nhập viện từ các hồ sơ bệnh án đã tồn tại
      const existingRecords = await hoSoBenhAnController.getAll();
      const idsWithRecord = new Set(existingRecords.map(record => record.maNhapVien));

      // Bước 2: Lấy toàn bộ danh sách bệnh nhân đang nội trú
      const allInpatients = await getAllRawInpatients();

      // Bước 3: Lọc ra những bệnh nhân có maNhapVien không nằm trong danh sách đã có hồ sơ
      const availableInpatients = allInpatients.filter(
        (patient) => !idsWithRecord.has(Number(patient.maNhapVien))
      );
      
      console.log('✅ Đã lọc, danh sách bệnh nhân có thể tạo hồ sơ:', availableInpatients.length);
      return availableInpatients;

    } catch (err) {
      console.error('❌ Lỗi khi lọc danh sách bệnh nhân nội trú chưa có hồ sơ:', err);
      return [];
    }
  },
  
  /**
   * 🌐 Lấy TOÀN BỘ danh sách bệnh nhân nội trú (không lọc).
   * Dùng để cho các controller khác kiểm tra sự tồn tại.
   */
  async getAllRaw(): Promise<BenhNhanNoiTru[]> {
      return getAllRawInpatients();
  },
};