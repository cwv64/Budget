// Authentication Module
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Auth state observer
export function initAuth(onUserLoggedIn, onUserLoggedOut) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            onUserLoggedIn(user);
        } else {
            onUserLoggedOut();
        }
    });
}

// Sign up new user
export async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Create initial budget data for new user
        const initialBudget = {
            currentAssets: {
                regions: 0,
                stocks: 0,
                venmo: 0,
                cash: 0,
                outstandingCredit: 0
            },
            otherAccounts: {
                rothIRA: 0,
                incomeRemaining: 0
            },
            outstandingEntries: [],
            journalEntries: [],
            monthlyExpenses: [],
            seasonalExpenses: [],
            nextExpenseId: 1,
            nextOutstandingId: 1
        };
        
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            budget: initialBudget,
            createdAt: new Date().toISOString()
        });
        
        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Sign in existing user
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        let message = error.message;
        if (error.code === 'auth/invalid-credential') {
            message = 'Invalid email or password';
        } else if (error.code === 'auth/user-not-found') {
            message = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
            message = 'Incorrect password';
        }
        return { success: false, error: message };
    }
}

// Sign out user
export async function logOut() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Load user's budget data
export async function loadUserBudget(userId) {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data().budget };
        } else {
            return { success: false, error: "No budget data found" };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Save user's budget data
export async function saveUserBudget(userId, budgetData) {
    try {
        await setDoc(doc(db, "users", userId), {
            budget: budgetData,
            lastUpdated: new Date().toISOString()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
