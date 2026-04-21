// lib/constants/public-session.constants.ts
import type { Category, MenuItem, RestaurantInfo } from "@/components/public-section/public-section.types";

export const RESTAURANT_INFO: RestaurantInfo = {
  name: "ชาร์ลส เลอแคลร์ (Charles Leclerc)",
  address:
    "สาขา ธรรมศาสตร์ ศูนย์รังสิต หมู่บ้านโมนาโก ซอยกะเพราความเร็วสูง ถ.สปีด แขวงผัดไทย เขตพระนคร 10110",
  logoUrl: "/public-section/logo.png",
  logoAlt: "RMS Logo",
};

export const CATEGORIES: Category[] = [
  { id: "all", label: "เมนูทั้งหมด" },
  { id: "single", label: "อาหารจานเดียว" },
  { id: "entree", label: "กับข้าว" },
  { id: "drink", label: "เครื่องดื่ม" },
  { id: "addon", label: "อื่นๆ" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว",
    price: 50,
    imageUrl: "/public-section/food-kaphrao.jpg",
    categoryId: "single",
    options: [
      { id: "opt-1", label: "หมูสับ" },
      { id: "opt-2", label: "หมูชิ้น" },
      { id: "opt-3", label: "ไก่สับ" },
      { id: "opt-4", label: "ไก่ชิ้น" },
      { id: "opt-5", label: "หมูกรอบ", priceAddon: 10 },
    ],
  },
  {
    id: "2",
    name: "ข้าวผัด (หมู / ไก่ / กุ้ง / ปู)",
    price: 50,
    imageUrl: "/public-section/food-khaopad.jpg",
    categoryId: "single",
    options: [
      { id: "opt-6", label: "หมู" },
      { id: "opt-7", label: "ไก่" },
      { id: "opt-8", label: "กุ้ง", priceAddon: 10 },
      { id: "opt-9", label: "ปู", priceAddon: 20 },
    ],
  },
  {
    id: "3",
    name: "ลาบหมู / ลาบไก่",
    price: 90,
    imageUrl: "/public-section/food-larb.jpg",
    categoryId: "entree",
  },
  {
    id: "4",
    name: "ต้มยำ (กุ้ง / รวมมิตร / น้ำข้น / น้ำใส)",
    price: 150,
    imageUrl: "/public-section/food-tomyum.jpg",
    categoryId: "entree",
    options: [
      { id: "opt-10", label: "น้ำข้น" },
      { id: "opt-11", label: "น้ำใส" },
    ],
  },
  {
    id: "5",
    name: "น้ำเปล่า (แช่เย็น / น้ำแข็งเปล่า)",
    price: 10,
    imageUrl: "/public-section/drink-water.jpg",
    categoryId: "drink",
    options: [
      { id: "opt-12", label: "แช่เย็น" },
      { id: "opt-13", label: "น้ำแข็งเปล่า" },
    ],
  },
  {
    id: "6",
    name: "น้ำอัดลม (โคล่า / น้ำแดง / น้ำส้ม)",
    price: 20,
    imageUrl: "/public-section/drink-soda.jpg",
    categoryId: "drink",
    options: [
      { id: "opt-14", label: "โคล่า" },
      { id: "opt-15", label: "น้ำแดง" },
      { id: "opt-16", label: "น้ำส้ม" },
    ],
  },
  {
    id: "7",
    name: "ไข่ดาว (กรอบ / ไม่สุก)",
    price: 10,
    imageUrl: "/public-section/egg.jpg",
    categoryId: "addon",
    options: [
      { id: "opt-17", label: "กรอบ" },
      { id: "opt-18", label: "ไม่สุก" },
    ],
  },
  {
    id: "8",
    name: "ข้าวเปล่า (จาน / ถ้วย)",
    price: 10,
    imageUrl: "/public-section/rice.jpg",
    categoryId: "addon",
    options: [
      { id: "opt-19", label: "จาน" },
      { id: "opt-20", label: "ถ้วย" },
    ],
  },
];
