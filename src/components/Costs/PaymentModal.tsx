import React, { useState, useRef } from 'react';
import { X, QrCode, Download, Check, CreditCard, Banknote } from 'lucide-react';
import { Cost, Patient } from '../../types';

interface PaymentModalProps {
  cost: Cost;
  patient: Patient;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ cost, patient, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cash' | 'card'>('qr');
  const [isPaid, setIsPaid] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handlePayment = () => {
    setIsPaid(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const downloadQR = () => {
    // Simulate QR code download
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 200;
      canvas.height = 200;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      
      const link = document.createElement('a');
      link.download = `QR-${patient.fullName}-${cost.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (isPaid) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600 mb-4">
            Viện phí của bệnh nhân {patient.fullName} đã được thanh toán.
          </p>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(cost.remainingPayment)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Thanh toán viện phí
              </h2>
              <p className="text-gray-600">Bệnh nhân: {patient.fullName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Chi tiết thanh toán</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Chi phí thuốc:</span>
                <span>{formatCurrency(cost.medicationCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Chi phí xét nghiệm/thủ thuật:</span>
                <span>{formatCurrency(cost.testCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Chi phí giường bệnh:</span>
                <span>{formatCurrency(cost.bedCost)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tạm ứng:</span>
                <span>-{formatCurrency(cost.advancePayment)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Còn phải thanh toán:</span>
                <span className="text-orange-600">{formatCurrency(cost.remainingPayment)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Phương thức thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod('qr')}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'qr' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span>QR Code</span>
              </button>
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'cash' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Tiền mặt</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border rounded-lg flex items-center justify-center space-x-2 transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Thẻ</span>
              </button>
            </div>
          </div>

          {/* Payment Interface */}
          {paymentMethod === 'qr' && (
            <div className="text-center mb-6">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-8 mb-4 inline-block">
                <div 
                  ref={qrRef}
                  className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center mx-auto"
                >
                  {/* QR Code placeholder */}
                  <div className="w-40 h-40 bg-white rounded grid grid-cols-8 gap-1 p-2">
                    {Array.from({length: 64}).map((_, i) => (
                      <div 
                        key={i} 
                        className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Quét mã QR để thanh toán {formatCurrency(cost.remainingPayment)}
              </p>
              <button
                onClick={downloadQR}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center space-x-1 mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Tải xuống mã QR</span>
              </button>
            </div>
          )}

          {paymentMethod === 'cash' && (
            <div className="text-center mb-6 p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">Thanh toán tiền mặt</h4>
              <p className="text-gray-600">
                Số tiền cần thanh toán: <span className="font-semibold">{formatCurrency(cost.remainingPayment)}</span>
              </p>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="text-center mb-6 p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">Thanh toán bằng thẻ</h4>
              <p className="text-gray-600">
                Vui lòng chọn loại thẻ và nhập thông tin thanh toán
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handlePayment}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Xác nhận thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;