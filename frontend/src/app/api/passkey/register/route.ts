import { NextResponse } from 'next/server';

// Simple in-memory store for dev only
const storeKey = '__PASSKEY_STORE__';

function getStore() {
  // @ts-ignore
  if (!globalThis[storeKey]) globalThis[storeKey] = { users: new Map(), challenges: new Map() };
  // @ts-ignore
  return globalThis[storeKey];
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, credentialId, publicKey } = body;
    if (!username || !credentialId || !publicKey) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const store = getStore();
    store.users.set(username, { credentialId, publicKey });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('register error', e);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
