"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { publicSession } from "@/services/publicSession";
import { publicService } from "@/services/public.service";

interface QrEntryPageProps {
  params: Promise<{ token: string }>;
}

export default function QrEntryPage({ params }: QrEntryPageProps) {
  const { token } = use(params);
  const router = useRouter();

  useEffect(() => {
    const bootstrapQrSession = async () => {
      const response = await publicService.verifyQrToken(token);
      if (!response.success || !response.data) {
        router.replace(`/home?error=${encodeURIComponent(response.message)}`);
        return;
      }

      publicSession.setQrToken(token);
      publicSession.setVerifiedQrSession(response.data);
      router.replace(`/home/menu?qrToken=${encodeURIComponent(token)}`);
    };

    void bootstrapQrSession();
  }, [router, token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
      <div>
        <p className="text-sm font-medium text-black/50">กำลังตรวจสอบ QR</p>
        <h1 className="mt-2 text-2xl font-bold text-black">กรุณารอสักครู่...</h1>
      </div>
    </main>
  );
}