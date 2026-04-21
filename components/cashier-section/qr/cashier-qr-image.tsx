export default function CashierQrImage({ qrCodeUrl }: { qrCodeUrl?: string | null }) {
  if (!qrCodeUrl) {
    return (
      <div className="text-gray-500 text-sm">
        ไม่มี QR Code สำหรับโต๊ะนี้
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg w-fit mx-auto">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrCodeUrl)}`}
        alt="qr"
      />
    </div>
  );
}