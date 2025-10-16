export interface BenhNhanNoiTru {
  // backend may return maNhapVien as string or number
  maNhapVien: string | number;
  maBenhNhan: string;
  hoTen: string;
  ngayNhapVien: string;
  khoaDieuTri: string;
  phong?: string | null;
  giuong: string;
  chuanDoan: string;
  trangThai: string;
}
