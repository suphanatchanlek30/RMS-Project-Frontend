// app/(public-session)/menu/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OptionInputField } from "@/components/public-section/menu-detail";
import { QuantityInputField } from "@/components/public-section/menu-detail";
import { useCart } from "@/components/public-section/cart-context";
import type { MenuItem } from "@/components/public-section/public-section.types";
import { itemService } from "@/services/item.service";
import { publicSession } from "@/services/publicSession";

interface MenuDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MenuDetailPage({ params }: MenuDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { addItem } = useCart();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true);

      const cachedBundle = publicSession.getMenuBundle();
      const cachedItem = cachedBundle?.items.find((menuItem) => menuItem.id === id) ?? null;
      if (cachedItem) {
        setItem(cachedItem);
        setIsLoading(false);
        return;
      }

      const qrToken = publicSession.getQrToken();
      if (!qrToken) {
        setItem(null);
        setIsLoading(false);
        return;
      }

      try {
        const bundle = await itemService.getMenuBundle(qrToken);
        publicSession.setMenuBundle(bundle);
        setItem(bundle.items.find((menuItem) => menuItem.id === id) ?? null);
      } catch {
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadItem();
  }, [id]);

  const defaultSelectedOptions = useMemo(
    () => (item?.options?.[0] ? [item.options[0].id] : []),
    [item]
  );

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedOptions(defaultSelectedOptions);
  }, [defaultSelectedOptions]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
        <p className="text-gray-500">กำลังโหลดเมนู...</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
        <p className="text-gray-500">ไม่พบเมนูนี้</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm font-semibold text-(--button-bg) underline"
        >
          กลับ
        </button>
      </main>
    );
  }

  const optionAddonTotal = selectedOptions.reduce((sum, optId) => {
    const opt = item.options?.find((o) => o.id === optId);
    return sum + (opt?.priceAddon ?? 0);
  }, 0);

  const totalPrice = (item.price + optionAddonTotal) * quantity;

  const toggleOption = (optId: string, checked: boolean) => {
    setSelectedOptions((prev) =>
      checked ? [...prev, optId] : prev.filter((o) => o !== optId)
    );
  };

  const handleAddToCart = () => {
    const selectedLabels = selectedOptions.map(
      (optId) => item.options?.find((o) => o.id === optId)?.label ?? optId
    );
    addItem(item, quantity, selectedLabels, note, totalPrice);
    router.push("/home/menu");
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Back button + title */}
      <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 relative">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="กลับ"
          className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-800">รายละเอียด</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Food image */}
        <div className="relative mx-4 mt-4 h-52 overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 640px"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2">
            <p className="text-xs text-white/90">({item.name.split("(")[1]?.replace(")", "") ?? item.name})</p>
          </div>
        </div>

        {/* Name & Price */}
        <div className="px-4 pt-4">
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {item.name}
          </h2>
          <p className="mt-1 text-base font-bold text-gray-800">
            ฿{item.price.toFixed(2)}
          </p>
        </div>

        {/* Options */}
        {item.options && item.options.length > 0 && (
          <div className="mt-5 px-4">
            <p className="mb-2 text-sm font-semibold text-gray-700">
              ตัวเลือก
            </p>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 bg-gray-50 px-3">
              {item.options.map((opt) => (
                <OptionInputField
                  key={opt.id}
                  id={opt.id}
                  label={opt.label}
                  priceAddon={opt.priceAddon}
                  checked={selectedOptions.includes(opt.id)}
                  onChange={toggleOption}
                />
              ))}
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-5 px-4">
          <p className="mb-2 text-sm font-semibold text-gray-700">
            รายละเอียดเพิ่มเติม (ถ้ามี)
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="เช่น ไม่เผ็ด, ไม่ใส่ผัก..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-(--primary-soft) resize-none"
          />
        </div>
      </div>

      {/* Bottom sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 border-t border-gray-100 bg-white px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <QuantityInputField value={quantity} min={1} onChange={setQuantity} />
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 h-12 rounded-xl bg-(--button-bg) text-sm font-bold text-white shadow transition-colors hover:bg-(--button-bg-hover) active:scale-95"
        >
          เพิ่มลงตะกร้า ฿{totalPrice}
        </button>
      </div>
    </main>
  );
}
