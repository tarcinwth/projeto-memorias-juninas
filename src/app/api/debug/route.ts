import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: Record<string, string> = {};

  // 1. Check env vars exist (without revealing values)
  diagnostics['FIREBASE_PROJECT_ID'] = process.env.FIREBASE_PROJECT_ID ? `SET (${process.env.FIREBASE_PROJECT_ID.length} chars)` : 'MISSING';
  diagnostics['FIREBASE_CLIENT_EMAIL'] = process.env.FIREBASE_CLIENT_EMAIL ? `SET (${process.env.FIREBASE_CLIENT_EMAIL.length} chars)` : 'MISSING';
  diagnostics['FIREBASE_PRIVATE_KEY'] = process.env.FIREBASE_PRIVATE_KEY ? `SET (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : 'MISSING';
  diagnostics['ADMIN_EMAIL'] = process.env.ADMIN_EMAIL ? `SET (${process.env.ADMIN_EMAIL.length} chars)` : 'MISSING';
  diagnostics['NEXT_PUBLIC_ADMIN_EMAIL'] = process.env.NEXT_PUBLIC_ADMIN_EMAIL ? `SET` : 'MISSING';

  // 2. Check private key format
  const pk = process.env.FIREBASE_PRIVATE_KEY || '';
  diagnostics['PK_STARTS_WITH_QUOTE'] = pk.startsWith('"') ? 'YES' : 'NO';
  diagnostics['PK_STARTS_WITH_BEGIN'] = pk.startsWith('-----BEGIN') ? 'YES' : 'NO';
  diagnostics['PK_CONTAINS_LITERAL_BACKSLASH_N'] = pk.includes('\\n') ? 'YES' : 'NO';
  diagnostics['PK_CONTAINS_REAL_NEWLINE'] = pk.includes('\n') ? 'YES' : 'NO';
  diagnostics['PK_FIRST_50_CHARS'] = pk.substring(0, 50).replace(/[A-Za-z0-9+/=]/g, '*');

  // 3. Try importing firebase-admin
  try {
    const { getApps, initializeApp, cert } = await import('firebase-admin/app');
    diagnostics['FIREBASE_ADMIN_IMPORT'] = 'SUCCESS';
    diagnostics['EXISTING_APPS'] = String(getApps().length);

    // 4. Try initializing (if not already done)
    if (!getApps().length) {
      let privateKey = pk;
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        try { privateKey = JSON.parse(privateKey); } catch (e) {}
      }
      privateKey = privateKey.replace(/\\n/g, '\n');

      try {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || '',
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
            privateKey: privateKey,
          }),
        });
        diagnostics['FIREBASE_ADMIN_INIT'] = 'SUCCESS';
      } catch (initErr: any) {
        diagnostics['FIREBASE_ADMIN_INIT'] = `FAILED: ${initErr.message}`;
      }
    } else {
      diagnostics['FIREBASE_ADMIN_INIT'] = 'ALREADY_INITIALIZED';
    }
  } catch (importErr: any) {
    diagnostics['FIREBASE_ADMIN_IMPORT'] = `FAILED: ${importErr.message}`;
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
