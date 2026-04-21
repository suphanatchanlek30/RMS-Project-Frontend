// app/(public-session)/home/page.tsx
import { WelcomeHero } from "@/components/public-section/welcome";
import { WelcomeCtaButton } from "@/components/public-section/welcome";

export default function WelcomePage() {
  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-between px-8 py-16"
      style={{
        background:
          "radial-gradient(ellipse at center, #8b0000 0%, #5a0000 40%, #2d0000 100%)",
      }}
    >
      {/* Texture overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23000' opacity='0.15'/%3E%3Crect x='0' y='0' width='2' height='2' fill='%23000' opacity='0.1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-12">
        <div className="mt-8">
          <WelcomeHero
            logoUrl="/public-section/logo.png"
            title="ยินดีต้อนรับสู่ครัวของ ชาเลส เลอแคลร์"
            subtitle="เพราะทุกจานคือความใส่ใจ เราไม่ได้แค่ทำอาหาร แต่เรา 'ปรุง' ด้วยหัวใจของแชมป์เปี้ยน"
          />
        </div>
        <div className="w-full">
          <WelcomeCtaButton
            label="สั่งเลย เพื่อเปิดประสบการณ์ระดับแชมป์"
            tableNumber="1"
            href="/home/menu"
          />
        </div>
      </div>

      {/* Footer brand */}
      <div className="relative z-10 flex items-center gap-2">
        <div className="h-px w-12 bg-white/30" />
        <span className="text-xs text-white/50 tracking-widest">ตามสั่งรถซิง</span>
        <div className="h-px w-12 bg-white/30" />
      </div>
    </main>
  );
}
