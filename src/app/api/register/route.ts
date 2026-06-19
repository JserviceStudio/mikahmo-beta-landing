import { NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://live.mikhmoai.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${API_BASE}/api/beta/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Erreur proxy inscription:', error);
    return NextResponse.json(
      { error: 'Une erreur interne est survenue. Veuillez réessayer plus tard.' },
      { status: 500 }
    );
  }
}
