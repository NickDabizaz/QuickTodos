import RoomPageClient from '../../components/RoomPageClient';

// Fungsi ini diperlukan untuk static export dengan dynamic routes
export async function generateStaticParams() {
  // Kita menghasilkan halaman kosong saja, karena roomId akan dibuat secara dinamis
  return [];
}

export default function RoomPage() {
  // Server component yang hanya merender client component
  return <RoomPageClient />;
} 