// app/(public)/home/page.tsx

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Public Home Page!</h1>
      <p className="mt-4 text-lg">This page is accessible to everyone.</p>
    </main>
  );
}