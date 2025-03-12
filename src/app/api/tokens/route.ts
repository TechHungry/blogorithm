// src/app/api/tokens/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateToken, deleteToken, listTokens } from '@/lib/tokenStorage';

function validateAdminPassword(password: string) {
    return password === process.env.ADMIN_PASSWORD;
}

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !validateAdminPassword(authHeader)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const tokens = await listTokens();
        return NextResponse.json({ tokens });
    } catch (error) {
        console.error("Error listing tokens:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !validateAdminPassword(authHeader)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const newToken = await generateToken();
        return NextResponse.json({ token: newToken });
    } catch (error) {
        console.error("Error generating token:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !validateAdminPassword(authHeader)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }

    try {
        const success = await deleteToken(id);

        if (!success) {
            return NextResponse.json({ error: 'Token not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting token:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}