// src/app/api/setup-admin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { setAdminEmail, getAdminEmail, UserRole, saveUser } from '@/lib/userPermissions';

export async function POST(request: NextRequest) {
    try {
        const setupKey = process.env.ADMIN_SETUP_KEY;

        // Check if we have a setup key in our environment
        if (!setupKey) {
            return NextResponse.json({ error: 'Setup key not configured' }, { status: 500 });
        }

        // Get provided key and admin email from request
        const { key, adminEmail, adminName } = await request.json();

        // Validate key
        if (key !== setupKey) {
            return NextResponse.json({ error: 'Invalid setup key' }, { status: 401 });
        }

        if (!adminEmail) {
            return NextResponse.json({ error: 'Admin email is required' }, { status: 400 });
        }

        // Check if admin is already set
        const currentAdmin = await getAdminEmail();
        if (currentAdmin) {
            return NextResponse.json({
                error: 'Admin is already configured',
                currentAdmin
            }, { status: 400 });
        }

        // Set the admin email
        await setAdminEmail(adminEmail);

        // Create admin user
        const adminUser = {
            id: crypto.randomUUID(),
            name: adminName || 'Administrator',
            email: adminEmail,
            role: UserRole.ADMIN,
            createdAt: new Date().toISOString()
        };

        await saveUser(adminUser);

        return NextResponse.json({
            success: true,
            message: `Admin set to ${adminEmail}. You can now log in with this Google account.`
        });
    } catch (error) {
        console.error('Error setting up admin:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}