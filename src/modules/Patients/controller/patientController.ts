import { BenhNhan } from '../model/patientModel';

const BASE_URL = 'http://localhost:3000/';
const API = BASE_URL + 'api/v1/benhnhan';
const API_NHAPVIEN = BASE_URL + 'api/v1/nhapvien'; // ✅ endpoint riêng cho nhập viện

export const patientController = {
  // ✅ Lấy danh sách bệnh nhân 
  async getAll(): Promise<BenhNhan[]> {
    try {
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);

      const data = await res.json();
      return data.map((item: any) => ({
        maBenhNhan: item.maBenhNhan,
        hoTen: item.hoTen,
        ngaySinh: item.ngaySinh,
        gioiTinh: item.gioiTinh,
        soCMND: item.soCMND,
        diaChi: item.diaChi,
      })) as BenhNhan[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách bệnh nhân:', err);
      return [];
    }
  },

  // ✅ Lấy chi tiết bệnh nhân theo ID
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

  // ✅ Thêm bệnh nhân nội trú (nhập viện)
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

      if (!res.ok) throw new Error(`Lỗi khi thêm bệnh nhân nội trú: ${res.status}`);
      console.log('✅ Thêm bệnh nhân nội trú thành công');
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi thêm bệnh nhân nội trú:', err);
      return false;
    }
  },
};
