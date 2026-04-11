export default function CashierQrImage({ tableId }: { tableId: string }) {
  
  // mock เฉพาะโต๊ะ 3
  const mockQrByTable: Record<string, string> = {
    "3": "https://your-app.com/table/3",
  };

  const qrUrl = mockQrByTable[tableId];

  // ถ้าไม่ใช่โต๊ะ 3 → ไม่มี QR
  if (!qrUrl) {
    return (
      <div className="text-gray-500 text-sm">
        ไม่มี QR Code สำหรับโต๊ะนี้
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg w-fit mx-auto">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrUrl}`}
        alt="qr"
      />
    </div>
  );
}