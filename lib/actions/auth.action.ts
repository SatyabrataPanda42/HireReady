'use server';
import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // in milliseconds


export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;
    try {
        const userRecord = await db.collection('users').doc(uid).get();
        if(userRecord.exists){
            return{
                success:false,
                message:"User already exists. Sign in instead",
            }
        }
        await db.collection('users').doc(uid).set({
            name,email
        })
        return{
            success: true,
            message: "User created successfully",
        }
    } catch (e: any) {
        console.error("Error creating user:", e);  // Log the error for debugging
        if (e.code === "auth/email-already-in-use") {
            return {
                success: false,
                message: "Email already in use",
            };
        }

        return {
            success: false,
            message: "An error occurred",
        };
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;
    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found. Sign up instead',
            };
        }

        await setSessionCookie(idToken);
    } catch (e: any) {
        console.log(e);
        return {
            success: false,
            message: 'An error occurred',
        };
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn: ONE_WEEK });
        cookieStore.set('session', sessionCookie, {
            maxAge: ONE_WEEK, // Convert ms to seconds
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            sameSite: 'lax',
        });
}

export async function getCurrentUser(): Promise<User | null> {
   
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('session')?.value;
        if (!sessionCookie) return null;
        try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            console.error('User not found in fireStore:', decodedClaims.uid);
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        }as User;
    } catch (e) {
        console.error('Error getting current user:', e);
        return null;
    }
}
export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}