import { HoSoBenhAn } from '../model/medicalRecordModel';

const BASE_URL = 'http://localhost:3000/';
const API = BASE_URL + 'api/v1/danhsachbenhannoitru';
const ADD_API = BASE_URL + 'api/v1/benhannoitru';
const DELETE_API = BASE_URL + 'api/v1/xoabenhannoitru';
const UPDATE_API = BASE_URL + 'api/v1/updatebenhannoitru';

export const hoSoBenhAnController = {
  // 📘 Lấy danh sách hồ sơ bệnh án nội trú
  async getAll(): Promise<HoSoBenhAn[]> {
    try {
      const res = await fetch(API, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);

      const data = await res.json();
      return data.map((item: any) => ({
        maBenhAn: item.maBenhAn,
        maNhapVien: item.maNhapVien,
        ngayLap: item.ngayLap,
        tomTatBenhAn: item.tomTatBenhAn,
        tienSuBenh: item.tienSuBenh,
        ketQuaDieuTri: item.ketQuaDieuTri,
        trangThai: item.trangThai,
        hinhAnhUrl: item.hinhAnhUrl,
        page: item.page,
        size: item.size,
      })) as HoSoBenhAn[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách hồ sơ bệnh án:', err);
      return [];
    }
  },

  // 🔍 Lấy hồ sơ bệnh án theo ID
  async getById(id: string): Promise<HoSoBenhAn | null> {
    try {
      const res = await fetch(`${API}/${id}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('❌ Lỗi khi lấy chi tiết hồ sơ bệnh án:', err);
      return null;
    }
  },

  // ➕ Thêm hồ sơ bệnh án mới
  async add(data: {
    maNhapVien: number;
    ngayLap: string;
    tomTatBenhAn: string;
    tienSuBenh: string;
    ketQuaDieuTri: string;
    trangThai: string;
    HinhAnh?: string | null; // base64 hoặc link
  }): Promise<boolean> {
    try {
      const res = await fetch(ADD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Lỗi khi thêm hồ sơ bệnh án: ${res.status}`);
      console.log('✅ Thêm hồ sơ bệnh án thành công');
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi thêm hồ sơ bệnh án:', err);
      return false;
    }
  },

  // ✏️ Cập nhật hồ sơ bệnh án theo ID
  async update(
    id: number,
    data: {
      maNhapVien: number;
      ngayLap: string;
      tomTatBenhAn: string;
      tienSuBenh: string;
      ketQuaDieuTri: string;
      trangThai: string;
      HinhAnh?: string | null; // base64 hoặc link
    }
  ): Promise<boolean> {
    try {
      const res = await fetch(`${UPDATE_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Lỗi khi cập nhật hồ sơ bệnh án: ${res.status}`);
      console.log(`📝 Cập nhật hồ sơ bệnh án ID=${id} thành công`);
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật hồ sơ bệnh án:', err);
      return false;
    }
  },

  // ❌ Xóa hồ sơ bệnh án theo ID
  async delete(id: number): Promise<boolean> {
    try {
      const res = await fetch(`${DELETE_API}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error(`Lỗi khi xóa hồ sơ bệnh án: ${res.status}`);
      console.log(`🗑️ Xóa hồ sơ bệnh án ID=${id} thành công`);
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi xóa hồ sơ bệnh án:', err);
      return false;
    }
  },
};
