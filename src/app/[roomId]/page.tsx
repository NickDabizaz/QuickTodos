import React from 'react';
import RoomPageClient from '../../components/RoomPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QuickTodos Room',
  description: 'Collaborative todo list room',
};

// This function is required for static export with dynamic routes
export async function generateStaticParams() {
  // Generate a default empty list for the static build
  // All other routes will be handled client-side
  return [
    { roomId: 'index' },
    { roomId: 'demo' }
  ];
}

// Make the component async to properly handle params
export default async function RoomPage({ params }: { params: { roomId: string } }) {
  // Since we're using the params in a simple way, we can just pass it along
  // For more complex scenarios, you might need to fetch data based on the roomId
  return <RoomPageClient roomId={params.roomId} />;
} 