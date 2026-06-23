import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getFirebaseAdmin() {
  const { getApps, initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { getAuth } = await import('firebase-admin/auth');

  if (!getApps().length) {
    let rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
    let privateKey = rawKey;
    
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      try { privateKey = JSON.parse(privateKey); } catch (e) {}
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'demo@example.com',
      privateKey: privateKey || '-----BEGIN PRIVATE KEY-----\nDEMO\n-----END PRIVATE KEY-----\n',
    };

    initializeApp({
      credential: cert(serviceAccount),
    });
  }

  return {
    db: getFirestore(),
    auth: getAuth()
  };
}

export async function GET(request: NextRequest) {
  try {
    const { db, auth } = await getFirebaseAdmin();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    let adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
    adminEmail = adminEmail.replace(/['"]/g, '').trim();
    if (decodedToken.email !== adminEmail) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const snapshot = await db.collection('moderacao')
      .where('status', '==', 'pendente')
      .get();

    const fila = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });

    fila.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return NextResponse.json(fila);
  } catch (error: any) {
    console.error('Erro na API de moderação:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { db, auth } = await getFirebaseAdmin();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Check if user is admin (you can implement custom claims or role check)
    // For now, assuming anyone hitting this with a valid token needs to be checked.
    // In production, add: if (!decodedToken.admin) throw new Error('Não admin');
    
    const user = await auth.getUser(decodedToken.uid);
    let adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
    adminEmail = adminEmail.replace(/['"]/g, '').trim();
    
    if (user.email !== adminEmail) {
        console.warn('Tentativa de moderação bloqueada para o email:', user.email);
        return NextResponse.json({ error: 'Permissão negada. Apenas administradores podem moderar.' }, { status: 403 });
    }

    const body = await request.json();
    const { memoriaId, action } = body;

    if (!memoriaId || !['aprovar', 'rejeitar'].includes(action)) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const memoriaRef = db.collection('memorias').doc(memoriaId);
    
    if (action === 'aprovar') {
      await memoriaRef.update({ status: 'aprovado' });
    } else if (action === 'rejeitar') {
      await memoriaRef.update({ status: 'rejeitado' });
    }

    const moderacaoSnap = await db.collection('moderacao').where('memoriaId', '==', memoriaId).get();
    if (!moderacaoSnap.empty) {
      await moderacaoSnap.docs[0].ref.update({ status: action === 'aprovar' ? 'processado' : 'rejeitado' });
    }

    return NextResponse.json({ success: true, memoriaId, action });
  } catch (error: any) {
    console.error('Moderation API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
