export interface HoSoBenhAn {
  maBenhAn: number;
  maBenhNhan: string;      // Thêm mới
  hoTen: string;            // Thêm mới
  maNhapVien: number;
  ngayLap: string;
  tomTatBenhAn: string;
  tienSuBenh: string;
  ketQuaDieuTri: string;
  trangThai: string;
  hinhAnhUrl?: string | null;
  page?: number;
  size?: number;
}