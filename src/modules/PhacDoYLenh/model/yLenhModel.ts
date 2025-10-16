export interface YLenh {
  maYLenh: number;        // ID y lệnh
  maBenhAn: number;       // Liên kết với hồ sơ bệnh án
  noiDung: string;         // Nội dung y lệnh
  trangThai: string;       // Trạng thái y lệnh ("Đang thực hiện", "Chờ thực hiện", ...)
  fileData: string | null; // File đính kèm, null nếu không có
}
