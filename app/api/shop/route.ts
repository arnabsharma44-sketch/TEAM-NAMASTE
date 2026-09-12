// app/api/shop/route.ts
import { NextResponse } from 'next/server';
import { SHOP_ITEMS } from '@/lib/shop-catalogue';

export async function GET() {
  return NextResponse.json(SHOP_ITEMS);
}
