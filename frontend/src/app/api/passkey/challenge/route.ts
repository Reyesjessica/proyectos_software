import { NextResponse } from 'next/server';

const storeKey = '__PASSKEY_STORE__';
function getStore() {
  // @ts-ignore
  if (!globalThis[storeKey]) globalThis[storeKey] = { users: new Map(), challenges: new Map() };
  // @ts-ignore
  return globalThis[storeKey];
}

function randomChallenge() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Buffer.from(arr).toString('base64url');
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) return NextResponse.json({ success: false, error: 'Missing username' }, { status: 400 });

    const store = getStore();
    const challenge = randomChallenge();
    store.challenges.set(username, { challenge, createdAt: Date.now() });

    return NextResponse.json({ success: true, challenge });
  } catch (e) {
    console.error('challenge error', e);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
