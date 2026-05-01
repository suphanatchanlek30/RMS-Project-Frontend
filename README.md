# RMS Project Frontend

โปรเจกต์ Frontend สำหรับระบบร้านอาหาร ใช้ Next.js App Router และ Tailwind CSS เป็นหลัก โครงสร้างโค้ดถูกแยกตามหน้าที่เพื่อให้ง่ายต่อการพัฒนา ดูแล และขยายต่อในทีม

## ภาพรวมโครงสร้างโปรเจกต์

### `app/`
เก็บหน้าเว็บทั้งหมดตามแนวคิดของ Next.js App Router

- `app/layout.tsx` = layout หลักของทั้งแอป
- `app/globals.css` = global styles และตัวแปรสีร่วมของโปรเจกต์
- `app/page.tsx` = หน้าเริ่มต้นของโปรเจกต์
- `app/(chef)/` = กลุ่มหน้าที่เกี่ยวกับฝั่ง Chef
- `app/(admin)/` = กลุ่มหน้าที่เกี่ยวกับฝั่ง Admin
- `app/(public)/` = กลุ่มหน้าที่เปิดให้ผู้ใช้ทั่วไป

ตัวอย่างในโปรเจกต์นี้

- `app/(chef)/auth/page.tsx` = หน้าเข้าสู่ระบบของ Chef
- `app/(public)/home/page.tsx` = หน้า Home ฝั่ง Public

### `components/`
เก็บ UI ที่นำกลับมาใช้ซ้ำได้ แยกตามโดเมนของระบบ

- `components/chef-section/` = component ของฝั่ง Chef
- `components/admin-section/` = component ของฝั่ง Admin
- `components/public-section/` = component ของฝั่ง Public

ภายใน `components/chef-section/auth-chef/` จะมีไฟล์ที่แยกหน้าที่ชัดเจน เช่น

- `chef-auth-login.tsx` = component หลักที่ประกอบหน้า login
- `chef-auth-hero.tsx` = ส่วนภาพ/hero ฝั่งซ้าย
- `chef-auth-card.tsx` = การ์ดฟอร์มเข้าสู่ระบบ
- `chef-auth-input-field.tsx` = ช่องกรอกข้อมูลแบบ reusable
- `auth-chef.types.ts` = interface/type ของโมดูลนี้
- `index.ts` = barrel export สำหรับ import จากจุดเดียว

### `lib/`
เก็บของที่เป็น logic กลางของโปรเจกต์ เช่น constants, helper, utility หรือค่าที่ใช้ร่วมกันหลายจุด

- `lib/constants/` = ค่าคงที่ของแอป
- `lib/constants/chef-auth.constants.ts` = ข้อความ/รูป/ค่าที่ใช้กับหน้า Chef Auth
- `lib/constants/index.ts` = export รวม constants

### `public/`
เก็บไฟล์ static ที่เรียกใช้ตรงได้ เช่น รูปภาพ ไอคอน และไฟล์สื่ออื่น ๆ

- `public/chef-section/` = รูปภาพที่ใช้กับหน้า Chef

## แนวทางการเพิ่มไฟล์ใหม่

### ถ้าเป็นหน้าใหม่
ให้เพิ่มใน `app/` ตาม route ที่ต้องการ เช่น

- หน้า Chef ใหม่ -> `app/(chef)/.../page.tsx`
- หน้า Public ใหม่ -> `app/(public)/.../page.tsx`

### ถ้าเป็น component ใหม่
ให้ใส่ใน `components/` ตามกลุ่มงานที่เกี่ยวข้อง เช่น

- ฝั่ง Chef -> `components/chef-section/`
- ฝั่ง Admin -> `components/admin-section/`

ถ้า component ถูกใช้ซ้ำหลายที่ ให้แยกเป็นไฟล์ย่อยตามหน้าที่ เช่น

- `*-card.tsx` = การ์ด
- `*-hero.tsx` = ส่วนภาพหรือ header area
- `*-input-field.tsx` = input field
- `index.ts` = export รวม

### ถ้าเป็นค่าคงที่หรือข้อความที่ใช้ร่วมกัน
ให้เก็บไว้ใน `lib/constants/` ไม่ควร hardcode ซ้ำในหลายไฟล์

### ถ้าเป็นรูปหรือ asset
ให้วางใน `public/` แล้วอ้างอิงด้วย path เช่น `/chef-section/chef-section-login.png`

## กติกาการเขียนโค้ดในโปรเจกต์นี้

1. แยกหน้าที่ของไฟล์ให้ชัดเจน อย่าให้ไฟล์ใหญ่เกินไป
2. ใช้ `index.ts` เพื่อรวม export เมื่อมีหลายไฟล์ในโมดูลเดียวกัน
3. ใช้ `lib/constants` สำหรับค่าที่ใช้ซ้ำ เช่น label, title, path ของรูป
4. ใช้ Tailwind ใน TSX สำหรับ styling หลัก
5. ใช้ `globals.css` สำหรับตัวแปรสีและ style กลางของทั้งโปรเจกต์
6. ตั้งชื่อไฟล์ให้สื่อความหมาย เช่น `chef-auth-card.tsx`, `chef-auth-hero.tsx`

## คำสั่ง Git พื้นฐาน

### ดูสถานะงาน

```bash
git status
```

### ดึงโค้ดล่าสุด

```bash
git checkout main
git pull origin main

git checkout dev
git pull origin dev
```

อธิบายสั้น ๆ

- `git checkout main` = สลับไป branch `main`
- `git pull origin main` = ดึงโค้ดล่าสุดของ `main`
- `git checkout dev` = สลับไป branch `dev`
- `git pull origin dev` = อัปเดต `dev` ให้ล่าสุด

### สร้าง branch งานใหม่

```bash
git checkout dev
git checkout -b feat/login-page
```

อธิบายสั้น ๆ

- `git checkout dev` = สลับไป branch `dev` ก่อนเริ่มงาน
- `git checkout -b feat/login-page` = สร้าง branch งานใหม่จาก `dev` และสลับไปทำงานทันที

### บันทึกงาน

```bash
git add .
git commit -m "feat: add login page layout"
```

### ส่ง branch ขึ้น remote

```bash
git push -u origin feat/login-page
```

### เช็กก่อนส่ง PR

```bash
npm install
npm run build
```

ถ้า `npm run build` ไม่ผ่าน ยังไม่ควรเปิด PR

## Flow การทำงานแนะนำ

1. ดึงโค้ดล่าสุดจาก `main` และ `dev`
2. สร้าง branch งานจาก `dev`
3. พัฒนา feature บน branch นั้น
4. รัน build ให้ผ่านก่อน commit
5. push branch ขึ้น remote
6. เปิด PR จาก `feat/*` ไป `dev`
7. เมื่อรวมงานและพร้อม release ค่อย merge `dev` เข้า `main`

## ตัวอย่างการใช้งานจริง

- ถ้าจะทำหน้า Login ใหม่ ให้วาง route ที่ `app/(chef)/auth/page.tsx`
- ถ้าจะทำ component ฟอร์ม login ให้แยกไว้ใน `components/chef-section/auth-chef/`
- ถ้าจะเพิ่มข้อความหรือค่าที่ใช้ซ้ำ ให้เพิ่มใน `lib/constants/`
- ถ้าจะเพิ่มรูป ให้เก็บใน `public/chef-section/`

## หมายเหตุ

- อย่าแก้ UI กระจายหลายไฟล์โดยไม่จำเป็น
- ถ้า logic หรือ UI ใช้ซ้ำหลายจุด ให้ย้ายออกเป็น component หรือ constant
- ถ้าต้องเพิ่มไฟล์ใหม่ ให้เลือกโฟลเดอร์ให้ตรงกับหน้าที่ของไฟล์ก่อนเสมอ

## Run Docker แบบแยกโฟลเดอร์ (Frontend/Backend คนละ repo)

โฟลเดอร์ frontend นี้มี `docker-compose.yml` ที่ออกแบบมาให้ต่อเข้ากับ network ของ backend ได้โดยตรง

1. เปิด backend ขึ้นก่อน (ใน repo backend) เพื่อให้ network backend ถูกสร้าง
2. ที่ repo frontend รันคำสั่งต่อไปนี้

```bash
docker compose build --no-cache
docker compose up -d
```

3. ตรวจสอบว่า frontend join network backend สำเร็จ

```bash
docker inspect rms-frontend --format '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}'
```

ค่า env สำคัญ

- `NEXT_PUBLIC_URL` / `NEXT_PUBLIC_API_URL`: URL ที่ browser จะยิง API (ปกติใช้ `http://localhost:8080`)
- `INTERNAL_API_URL`: URL ภายใน container สำหรับฝั่ง server (`http://rms-api:8080`)
- `BACKEND_DOCKER_NETWORK`: ชื่อ network backend ที่ frontend จะเข้าไป join (ค่า default คือ `rms-project-backend_default`)
- `FRONTEND_PORT`: พอร์ตฝั่งเครื่อง host (default `3000`) ถ้าพอร์ตชนให้ตั้งเป็น `3001` หรือพอร์ตอื่น

หมายเหตุ: ถ้า backend ใช้ชื่อ network อื่น ให้เปลี่ยน `BACKEND_DOCKER_NETWORK` ให้ตรงก่อน `docker compose up`
