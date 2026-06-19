import { NextResponse } from 'next/server';

const API_BASE = process.env.API_BASE_URL || 'https://live.mikhmoai.com';
// Token serveur uniquement — ne jamais exposer en NEXT_PUBLIC_*
const EXPORT_TOKEN = process.env.BETA_EXPORT_TOKEN || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('pwd');

  // Vérification mot de passe admin local (couche de protection frontend)
  const expectedPassword = process.env.ADMIN_PASSWORD || 'mikahmo-admin-2026';
  if (password !== expectedPassword) {
    return new NextResponse('Non autorisé', { status: 401 });
  }

  try {
    const res = await fetch(`${API_BASE}/api/beta/export`, {
      headers: { 'x-admin-token': EXPORT_TOKEN },
    });

    if (!res.ok) {
      const err = await res.text().catch(() => 'Erreur backend');
      console.error('Backend export error:', res.status, err);
      return new NextResponse('Non autorisé côté backend', { status: res.status });
    }

    const csvContent = await res.text();
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="mikahmo-beta-subscribers.csv"',
      },
    });
  } catch (error) {
    console.error('Erreur proxy export:', error);
    return new NextResponse('Erreur serveur lors de la génération du CSV', { status: 500 });
  }
}
