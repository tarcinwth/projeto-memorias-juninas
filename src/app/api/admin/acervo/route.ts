import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export const dynamic = 'force-dynamic';

async function getFirebaseAdmin() {
  if (!admin.apps.length) {
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

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return {
    db: admin.firestore(),
    auth: admin.auth()
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

    // Buscamos memorias aprovadas E ocultas para que o admin possa gerenciá-las
    const snapshotAprovados = await db.collection('memorias')
      .where('status', '==', 'aprovado')
      .get();
      
    const snapshotOcultos = await db.collection('memorias')
      .where('status', '==', 'oculto')
      .get();

    const fila = [...snapshotAprovados.docs, ...snapshotOcultos.docs].map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
      };
    });

    fila.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(fila);
  } catch (error: any) {
    console.error('Erro na API de acervo (GET):', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db, auth } = await getFirebaseAdmin();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const user = await auth.getUser(decodedToken.uid);
    let adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '';
    adminEmail = adminEmail.replace(/['"]/g, '').trim();
    
    if (user.email !== adminEmail) {
        return NextResponse.json({ error: 'Permissão negada. Apenas administradores podem moderar.' }, { status: 403 });
    }

    const body = await request.json();
    const { memoriaId, action, newType } = body;

    if (!memoriaId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const memoriaRef = db.collection('memorias').doc(memoriaId);
    
    if (action === 'ocultar') {
      await memoriaRef.update({ status: 'oculto' });
      
      // Update the moderacao collection as well if it exists
      const moderacaoSnap = await db.collection('moderacao').where('memoriaId', '==', memoriaId).get();
      if (!moderacaoSnap.empty) {
        await moderacaoSnap.docs[0].ref.update({ status: 'oculto' });
      }
    } else if (action === 'republicar') {
      await memoriaRef.update({ status: 'aprovado' });
      
      const moderacaoSnap = await db.collection('moderacao').where('memoriaId', '==', memoriaId).get();
      if (!moderacaoSnap.empty) {
        await moderacaoSnap.docs[0].ref.update({ status: 'processado' });
      }
    } else if (action === 'alterar_tipo') {
      if (!['imagem', 'video'].includes(newType)) {
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
      }
      await memoriaRef.update({ tipoMidia: newType });
    } else {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return NextResponse.json({ success: true, memoriaId, action });
  } catch (error: any) {
    console.error('Acervo API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
