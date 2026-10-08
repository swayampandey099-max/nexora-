import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
  Timestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with specific database ID from config
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId.length > 0
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Connection test as required by Firebase integration skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
    }
  }
}
testConnection();

export const OWNER_EMAIL = 'admin@nexora.digital';

export function isUserOwner(user: User | null): boolean {
  if (!user?.email) return false;
  const email = user.email.toLowerCase();
  return (
    email === OWNER_EMAIL.toLowerCase() ||
    email === 'swayampandey099@gmail.com' ||
    email.startsWith('admin@')
  );
}

// Sign In with Google
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Sync user profile to Firestore
    if (user) {
      await setDoc(
        doc(db, 'users', user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Client',
          photoURL: user.photoURL || '',
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    }

    return user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

// Sign In with Email and Password
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await setDoc(
        doc(db, 'users', cred.user.uid),
        {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || email.split('@')[0],
          photoURL: cred.user.photoURL || '',
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return cred.user;
  } catch (error: any) {
    // If account doesn't exist yet for standard client, attempt to register automatically
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, pass);
        return newCred.user;
      } catch (createErr) {
        throw error;
      }
    }
    throw error;
  }
}

// Sign Out
export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// User state listener
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export interface BookingRecord {
  id?: string;
  userId?: string;
  clientName: string;
  clientEmail: string;
  company?: string;
  serviceId?: string;
  serviceName: string;
  timeline?: string;
  budget?: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface UserRecord {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  lastLogin?: string;
  createdAt?: string;
}

// Save discovery call booking to Firestore
export async function saveBookingToFirestore(booking: Omit<BookingRecord, 'id' | 'createdAt'>): Promise<string> {
  try {
    const bookingPayload = {
      ...booking,
      userId: auth.currentUser?.uid || 'guest',
      createdAt: new Date().toISOString(),
      timestamp: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'bookings'), bookingPayload);
    return docRef.id;
  } catch (error) {
    console.error('Error saving booking to Firestore:', error);
    throw error;
  }
}

// Fetch user's past bookings (with memory caching to survive concurrency spikes of 10,000+ users)
export async function fetchUserBookings(userEmail?: string, userId?: string): Promise<BookingRecord[]> {
  try {
    const cacheKey = `bookings_cache_${userId || 'guest'}_${userEmail || ''}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, expiry } = JSON.parse(cached);
        if (Date.now() < expiry) {
          return data;
        }
      } catch (_) {}
    }

    const bookingsRef = collection(db, 'bookings');
    let q;

    if (userId && userId !== 'guest') {
      q = query(bookingsRef, where('userId', '==', userId));
    } else if (userEmail) {
      q = query(bookingsRef, where('clientEmail', '==', userEmail));
    } else {
      return [];
    }

    const querySnapshot = await getDocs(q);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as BookingRecord;
      results.push({ ...data, id: docSnap.id });
    });

    // Cache the query results locally for 1 minute to prevent database overload
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data: results,
      expiry: Date.now() + 60 * 1000,
    }));

    return results;
  } catch (error) {
    console.error('Error fetching bookings from Firestore:', error);
    return [];
  }
}

// ADMIN: Fetch ALL actual bookings from Firestore (with 15s debounce caching)
export async function fetchAllBookingsAdmin(): Promise<BookingRecord[]> {
  try {
    const cacheKey = 'admin_all_bookings_cache';
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, expiry } = JSON.parse(cached);
        if (Date.now() < expiry) {
          return data;
        }
      } catch (_) {}
    }

    const bookingsRef = collection(db, 'bookings');
    const querySnapshot = await getDocs(bookingsRef);
    const results: BookingRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as BookingRecord;
      results.push({ ...data, id: docSnap.id });
    });

    const sortedResults = results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    // Cache results for 15 seconds to ease simultaneous query strain
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data: sortedResults,
      expiry: Date.now() + 15 * 1000,
    }));

    return sortedResults;
  } catch (error) {
    console.error('Error fetching all bookings for admin:', error);
    throw error;
  }
}

// ADMIN: Fetch ALL registered user accounts from Firestore (with 15s debounce caching)
export async function fetchAllUsersAdmin(): Promise<UserRecord[]> {
  try {
    const cacheKey = 'admin_all_users_cache';
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, expiry } = JSON.parse(cached);
        if (Date.now() < expiry) {
          return data;
        }
      } catch (_) {}
    }

    const usersRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersRef);
    const results: UserRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as UserRecord;
      results.push({ ...data, uid: docSnap.id });
    });

    const sortedResults = results.sort((a, b) => new Date(b.lastLogin || 0).getTime() - new Date(a.lastLogin || 0).getTime());

    // Cache results for 15 seconds to ease simultaneous query strain
    sessionStorage.setItem(cacheKey, JSON.stringify({
      data: sortedResults,
      expiry: Date.now() + 15 * 1000,
    }));

    return sortedResults;
  } catch (error) {
    console.error('Error fetching registered users for admin:', error);
    throw error;
  }
}

// ADMIN: Update booking appointment status
export async function updateBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'completed' | 'cancelled'
): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

// ADMIN: Delete / Archive booking
export async function deleteBookingRecord(bookingId: string): Promise<void> {
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}
