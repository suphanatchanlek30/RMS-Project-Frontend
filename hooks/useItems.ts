// hooks/useItems.ts
import { useState, useEffect, useCallback } from "react";
import type { ActiveTableInfo, Category, MenuItem } from "@/components/public-section/public-section.types";
import { itemService } from "@/services/item.service";
import { publicService } from "@/services/public.service";
import { publicSession } from "@/services/publicSession";

export function useItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tableInfo, setTableInfo] = useState<ActiveTableInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);

    const qrToken = publicSession.getQrToken();
    if (!qrToken) {
      setError("ไม่พบ qrToken กรุณาสแกน QR ใหม่อีกครั้ง");
      setItems([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    const verifyResult = await publicService.verifyQrToken(qrToken);
    if (!verifyResult.success || !verifyResult.data) {
      setError(verifyResult.message);
      publicSession.clearAll();
      setItems([]);
      setCategories([]);
      setLoading(false);
      return;
    }

    publicSession.setVerifiedQrSession(verifyResult.data);

    try {
      const bundle = await itemService.getMenuBundle(qrToken);
      publicSession.setMenuBundle(bundle);
      setTableInfo({
        tableId: verifyResult.data.tableId,
        tableNumber: bundle.tableNumber,
      });
      setCategories(bundle.categories);

      let filtered = [...bundle.items];
      if (debouncedSearch) {
        filtered = filtered.filter((item) =>
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }
      if (category && category !== "all") {
        filtered = filtered.filter((item) => item.categoryId === category);
      }
      setItems(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการดึงข้อมูลเมนู");
      setItems([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    categories,
    tableInfo,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
    refresh: fetchItems,
  };
}
