import { YLenh } from '../model/yLenhModel';

const BASE_URL = 'http://localhost:3000/';
const API_GET_ALL = BASE_URL + 'api/v1/phacdo/getAll';
const API_UPDATE = BASE_URL + 'api/v1/phacdo/update/';
const API_DELETE = BASE_URL + 'api/v1/phacdo/del/';

export const yLenhController = {
  // 📘 Lấy danh sách phác đồ y lệnh
  async getAll(): Promise<YLenh[]> {
    try {
      const res = await fetch(API_GET_ALL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);
      const data = await res.json();
      return data.map((item: any) => ({
        maYLenh: item.maYLenh,
        maBenhAn: item.maBenhAn,
        noiDung: item.noiDung,
        trangThai: item.trangThai,
        fileData: item.fileData,
      })) as YLenh[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách phác đồ y lệnh:', err);
      return [];
    }
  },

  // ✏️ Cập nhật y lệnh theo maYLenh với form-data
  // Nếu file=null hoặc undefined thì giữ nguyên file cũ
  async update(
    maYLenh: number,
    data: {
      maBenhAn?: number;
      maBacSi?: string;
      ngayGio?: string;
      noiDung?: string;
      trangThai?: string;
      file?: File | null;
    }
  ): Promise<boolean> {
    try {
      const formData = new FormData();
      if (data.maBenhAn !== undefined) formData.append('maBenhAn', String(data.maBenhAn));
      if (data.maBacSi) formData.append('maBacSi', data.maBacSi);
      if (data.ngayGio) formData.append('ngayGio', data.ngayGio);
      if (data.noiDung) formData.append('noiDung', data.noiDung);
      if (data.trangThai) formData.append('trangThai', data.trangThai);

      // Chỉ append file nếu có
      if (data.file !== null && data.file !== undefined) {
        formData.append('file', data.file);
      }

      const res = await fetch(`${API_UPDATE}${maYLenh}`, {
        method: 'PUT',
        body: formData,
      });

      return res.ok;
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật y lệnh:', err);
      return false;
    }
  },
  

  // 🗑️ Xóa y lệnh theo maYLenh
  async delete(maYLenh: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_DELETE}${maYLenh}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (err) {
      console.error('❌ Lỗi khi xóa y lệnh:', err);
      return false;
    }
  },
  
};

