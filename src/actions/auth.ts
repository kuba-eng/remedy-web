'use server';

import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';

export async function loginUser(prevState: any, formData: FormData) {
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    console.log('[Auth] Login attempt:', login);

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if ((login === 'test' && password === 'test') || (login && password)) {
        // Set secure HTTP-only cookie
        // Set secure HTTP-only cookie
        const cookieStore = await cookies();
        const isProduction = process.env.NODE_ENV === 'production';
        console.log('[Auth] Setting cookie. Production:', isProduction);

        cookieStore.set('remedy_session', 'demo-token', {
            httpOnly: true,
            secure: isProduction, // Ensure this is false on localhost
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
        });

        console.log('[Auth] Cookie set. Redirecting to /profil');

        redirect('/profil');
    }

    return { success: false, message: 'Neplatné přihlašovací údaje (zkuste test / test)' };
}


export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('remedy_session');
    return { success: true };
}

export async function checkSession() {
    const cookieStore = await cookies();
    return cookieStore.has('remedy_session');
}

export async function registerUser(prevState: any, formData: FormData) {
    console.log('[Auth] Register attempt');
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Redirect to login or dashboard
    // NOTE: redirect throws, so we don't return after it.
    // However, to satisfy the type signature of useFormState which expects a return value,
    // we just need valid code paths.

    // In a real scenario, we might return errors.
    // Ensure we have a conditional if we want to return state, but here we always redirect (success).
    // To make TS happy about the return type matching existing usages, we can add a dummy return after, 
    // or wrap in a condition.

    try {
        redirect('/login?registered=true');
    } catch (e) {
        // next/navigation redirect throws an error that must be re-thrown
        throw e;
    }

    return { success: false, message: 'Registrace se nezdařila' };
}
