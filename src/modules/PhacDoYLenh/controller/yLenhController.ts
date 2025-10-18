import { YLenh } from '../model/yLenhModel';
import { APIs } from '../../../config/apiConfig';
const BASE_URL = APIs;
const API_GET_ALL = BASE_URL + 'api/v1/phacdo/getAll';
const API_CREATE = BASE_URL + 'api/v1/phacdo/add'; 
const API_UPDATE = BASE_URL + 'api/v1/phacdo/update/';
const API_DELETE = BASE_URL + 'api/v1/phacdo/del/';

export const yLenhController = {
  // Hàm getAll không đổi
  async getAll(): Promise<YLenh[]> {
    try {
      const res = await fetch(API_GET_ALL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Lỗi khi gọi API: ${res.status}`);
      const data = await res.json();
      return data.map((item: any) => ({
        maYLenh: item.maYLenh,
        maBenhAn: item.maBenhAn,
        maBacSi: item.maBacSi,
        hoTen: item.hoTen,
        phong: item.phong,
        giuong: item.giuong,
        noiDung: item.noiDung,
        trangThai: item.trangThai,
        fileData: item.fileData,
        // ✨ LƯU Ý: Thêm lại ngayGio vào model nếu cần hiển thị
        ngayGio: item.ngayGio, 
      })) as YLenh[];
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách y lệnh:', err);
      return [];
    }
  },

  // Hàm create có thể cần thêm ngayGio nếu API yêu cầu
  async create(
    data: {
      maBenhAn: number;
      maBacSi: string;
      ngayGio: string; // ✨ SỬA LỖI: Thêm lại trường ngayGio
      noiDung: string;
      trangThai: string;
      file?: File | null;
    }
  ): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('maBenhAn', String(data.maBenhAn));
      formData.append('maBacSi', data.maBacSi);
      formData.append('ngayGio', data.ngayGio); // ✨ SỬA LỖI: Thêm lại trường ngayGio
      formData.append('noiDung', data.noiDung);
      formData.append('trangThai', data.trangThai);

      if (data.file) {
        formData.append('file', data.file);
      }

      const res = await fetch(API_CREATE, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`❌ Lỗi API ${res.status}:`, errorBody);
        return false;
      }
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi tạo y lệnh:', err);
      return false;
    }
  },

  /**
   * ✏️ Cập nhật một y lệnh
   */
  async update(
    maYLenh: number,
    // ✨ SỬA LỖI: Thêm lại trường ngayGio
    data: {
      maBenhAn?: number;
      maBacSi?: string;
      ngayGio?: string; // Bắt buộc cho update
      noiDung?: string;
      trangThai?: string;
      file?: File | null;
    }
  ): Promise<boolean> {
    try {
      const formData = new FormData();
      if (data.maBenhAn !== undefined) formData.append('maBenhAn', String(data.maBenhAn));
      if (data.maBacSi !== undefined) formData.append('maBacSi', data.maBacSi);
      if (data.trangThai !== undefined) formData.append('trangThai', data.trangThai);
      if (data.noiDung !== undefined) formData.append('noiDung', data.noiDung);
      // ✨ SỬA LỖI: Thêm lại dòng append 'ngayGio'
      if (data.ngayGio !== undefined) formData.append('ngayGio', data.ngayGio);

      if (data.file) formData.append('file', data.file);

      const res = await fetch(`${API_UPDATE}${maYLenh}`, {
        method: 'PUT',
        body: formData,
      });

      if (!res.ok) {
        const errorBody = await res.text();
        console.error(`❌ Lỗi API ${res.status}:`, errorBody);
        return false;
      }
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi cập nhật y lệnh:', err);
      return false;
    }
  },

  // Hàm delete không đổi
  async delete(maYLenh: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_DELETE}${maYLenh}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
          console.error(`❌ Lỗi khi xóa y lệnh: ${res.status}`);
          return false;
      }
      return true;
    } catch (err) {
      console.error('❌ Lỗi khi xóa y lệnh:', err);
      return false;
    }
  },
};