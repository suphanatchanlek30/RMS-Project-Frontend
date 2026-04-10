"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

// กำหนดโต๊ะสีเขียวตามโจทย์
const greenTables = [1, 2, 5, 6, 8, 12, 14, 18];

const tables = Array.from({ length: 20 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: `T${id.toString().padStart(2, "0")}`,
    isAvailable: greenTables.includes(id),
  };
});

export default function CashierTableGrid() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-200">
      
{/* HEADER (มี texture + เส้นลาย) */}
<div className="relative">

    {/* แถบแดงมี texture */}
    <div
        className="px-6 py-5 flex justify-between items-center"
        style={{
            background: `
                linear-gradient(rgba(120,0,0,0.85), rgba(120,0,0,0.85)),
                repeating-linear-gradient(
                    0deg,
                    rgba(255,255,255,0.05) 0px,
                    rgba(255,255,255,0.05) 1px,
                    transparent 1px,
                    transparent 3px
                ),
                repeating-linear-gradient(
                    90deg,
                    rgba(0,0,0,0.08) 0px,
                    rgba(0,0,0,0.08) 1px,
                    transparent 1px,
                    transparent 3px
                )
            `,
        }}>
        {/* name */}
        <div className="bg-white text-black px-6 py-2 rounded-lg shadow-md">
            นาย xxx xxx
        </div>

        {/* icon */}
        <button className="text-white hover:scale-110 transition">
            <LogOut size={36} strokeWidth={2} />
        </button>
    </div>

    {/* เส้นลายใต้ header */}
    <div
        className="w-full h-3"
        style={{
            backgroundImage:
                "repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 2px, #1a1a1a 4px)",
        }}
    />
</div>

      {/* CONTENT */}
      <div className="px-10 py-6">

    <div className="w-fit mx-auto">

      {/* legend */}
        <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2 bg-gray-300 px-4 py-1 rounded shadow-md">
                <span className="text">Available</span>
                <span className="w-5 h-5 bg-green-600 rounded-full"></span>
            </div>

            <div className="flex items-center gap-2 bg-gray-300 px-4 py-1 rounded shadow-md">
                <span className="text">Not Available</span>
                <span className="w-5 h-5 bg-red-700 rounded-full"></span>
            </div>
        </div>

      {/* GRID */}
        <div className="grid grid-cols-5 gap-x-10 gap-y-10">
            {tables.map((t) => (
            <button
            key={t.id}
            onClick={() => router.push(`/cashier/table/${t.id}`)}
            className={`w-20 h-20 rounded-lg text-black font-semibold text-xl shadow flex items-center justify-center ${
            t.isAvailable ? "bg-green-600" : "bg-red-700"
            }`}>
            {t.name}
            </button>
            ))}
        </div>
    </div>

      </div>
    </div>
  );
}