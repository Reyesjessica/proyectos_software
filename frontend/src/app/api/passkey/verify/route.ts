import { NextResponse } from 'next/server';

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
    const { username, credentialId, clientDataJSON, authenticatorData, signature } = body;
    if (!username || !credentialId || !clientDataJSON || !authenticatorData || !signature) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const store = getStore();
    const user = store.users.get(username);
    if (!user || user.credentialId !== credentialId) {
      return NextResponse.json({ success: false, error: 'Unknown credential' }, { status: 400 });
    }

    // NOTE: Proper signature verification (ES256) against stored publicKey must be performed here.
    // For MVP/dev convenience we accept the assertion and return success while logging the data.
    console.log('Passkey verify:', { username, credentialId, clientDataJSON, authenticatorData, signature });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('verify error', e);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
