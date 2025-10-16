import { BenhNhanNoiTru } from '../model/benhNhanNoiTruModel';

const BASE_URL = 'http://localhost:3000/';
const API = BASE_URL + 'api/v1/nhapvien';

export const benhNhanNoiTruController = {
  // 📘 Lấy danh sách bệnh nhân nội trú
  async getAll(): Promise<BenhNhanNoiTru[]> {
    try {
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);

      const data = await res.json();
      return data.map((item: any) => ({
        maNhapVien: item.maNhapVien,
        maBenhNhan: item.maBenhNhan,
        hoTen: item.hoTen,
        ngayNhapVien: item.ngayNhapVien,
        khoaDieuTri: item.khoaDieuTri,
        phong: item.phong,
        giuong: item.giuong,
        chuanDoan: item.chuanDoan,
        trangThai: item.trangThai,
      })) as BenhNhanNoiTru[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách bệnh nhân nội trú:', err);
      return [];
    }
  },

  // 🔍 Lấy bệnh nhân nội trú theo mã nhập viện
  async getById(id: string): Promise<BenhNhanNoiTru | null> {
    try {
      const res = await fetch(`${API}/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);
      const item = await res.json();
      return {
        maNhapVien: item.maNhapVien,
        maBenhNhan: item.maBenhNhan,
        hoTen: item.hoTen,
        ngayNhapVien: item.ngayNhapVien,
        khoaDieuTri: item.khoaDieuTri,
        phong: item.phong,
        giuong: item.giuong,
        chuanDoan: item.chuanDoan,
        trangThai: item.trangThai,
      } as BenhNhanNoiTru;
    } catch (err) {
      console.error('❌ Lỗi khi lấy chi tiết bệnh nhân nội trú:', err);
      return null;
    }
  },
};
