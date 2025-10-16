export interface BenhNhan {
  maBenhNhan: string;
  hoTen: string;
  ngaySinh: string; // ISO date string (VD: "1995-07-10")
  gioiTinh: 'M' | 'F'; // chỉ nhận M hoặc F
  soCMND: string;
  diaChi: string;
}
