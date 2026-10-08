// Cryptographically Secure Owner Authentication Service
// Uses Web Crypto SHA-256 salted hashing, rate limiting, and brute-force protection.
// No plaintext passwords exist in this source code.

const OWNER_PASSWORD_SALT = 'nexora_secure_salt_77a941e3';
const OWNER_PASSWORD_DEFAULT_HASH = '999a42445fa6ab9e4d4faabd94a99ef267ea229ca4d48e36e4e0c2b0b4641de7';

const OWNER_USER_SALT = 'nexora_user_salt_91f4';
// Hashes for 'admin_owner' and 'admin@nexora.digital'
const VALID_USERNAME_HASHES = [
  '1e9a934e22048f0a16056314474c0a5fb507a648bae9e231908c52f93cd7902d',
  '3b1f6d3f0df69c9eea0bb64699b858723aa315dc2c11a9ae6d3c3e4ba1b6a711',
];

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours

const STORAGE_KEYS = {
  SESSION_TOKEN: 'nexora_owner_session_token',
  SESSION_EXPIRES: 'nexora_owner_session_expires',
  FAILED_ATTEMPTS: 'nexora_auth_failed_attempts',
  LOCKOUT_TIME: 'nexora_auth_lockout_until',
  CUSTOM_PASS_HASH: 'nexora_owner_custom_pass_hash',
  CUSTOM_PASS_SALT: 'nexora_owner_custom_pass_salt',
};

// Internal owner constant
const OWNER_PRIMARY_EMAIL = 'admin@nexora.digital';

/**
 * Computes SHA-256 hash using native Web Crypto API
 */
export async function computeSha256(salt: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${text.trim()}`);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if brute-force lockout is currently active
 */
export function getLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  try {
    const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEYS.LOCKOUT_TIME) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return {
        isLocked: true,
        remainingSeconds: Math.ceil((lockoutUntil - now) / 1000),
      };
    }
  } catch {
    // fallback
  }
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Verifies username and password using salted SHA-256
 */
export async function verifyOwnerCredentials(
  username: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const lockout = getLockoutStatus();
  if (lockout.isLocked) {
    return {
      success: false,
      error: `Security Lockout Active: Too many failed attempts. Try again in ${Math.ceil(
        lockout.remainingSeconds / 60
      )} minutes.`,
    };
  }

  // 1. Verify Username
  const normalizedUser = username.trim().toLowerCase();
  const userHash = await computeSha256(OWNER_USER_SALT, normalizedUser);
  const isUserValid = VALID_USERNAME_HASHES.includes(userHash);

  // 2. Verify Password against stored custom hash or default salted hash
  const activeSalt = localStorage.getItem(STORAGE_KEYS.CUSTOM_PASS_SALT) || OWNER_PASSWORD_SALT;
  const activeExpectedHash =
    localStorage.getItem(STORAGE_KEYS.CUSTOM_PASS_HASH) || OWNER_PASSWORD_DEFAULT_HASH;

  const inputPasswordHash = await computeSha256(activeSalt, password);
  const isPasswordValid = inputPasswordHash === activeExpectedHash;

  if (isUserValid && isPasswordValid) {
    // Reset failed attempts
    localStorage.removeItem(STORAGE_KEYS.FAILED_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.LOCKOUT_TIME);

    // Create secure cryptographic session token
    grantOwnerSession();
    return { success: true };
  } else {
    // Increment failed attempts
    const currentFails = parseInt(localStorage.getItem(STORAGE_KEYS.FAILED_ATTEMPTS) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEYS.FAILED_ATTEMPTS, currentFails.toString());

    if (currentFails >= MAX_FAILED_ATTEMPTS) {
      localStorage.setItem(
        STORAGE_KEYS.LOCKOUT_TIME,
        (Date.now() + LOCKOUT_DURATION_MS).toString()
      );
      return {
        success: false,
        error: `Security Lockout Triggered: 5 failed attempts reached. Locked for 15 minutes.`,
      };
    }

    const remaining = MAX_FAILED_ATTEMPTS - currentFails;
    return {
      success: false,
      error: `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before security lockout.`,
    };
  }
}

/**
 * Grants an active owner session
 */
export function grantOwnerSession(): void {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  sessionStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
  sessionStorage.setItem(
    STORAGE_KEYS.SESSION_EXPIRES,
    (Date.now() + SESSION_EXPIRY_MS).toString()
  );
}

/**
 * Checks if the current browser session has valid owner privileges
 */
export function isOwnerSessionActive(): boolean {
  try {
    const token = sessionStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    const expires = parseInt(sessionStorage.getItem(STORAGE_KEYS.SESSION_EXPIRES) || '0', 10);
    return Boolean(token && expires > Date.now());
  } catch {
    return false;
  }
}

/**
 * Terminates the owner session
 */
export function revokeOwnerSession(): void {
  sessionStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRES);
}

/**
 * Allows the owner to safely change their password inside the portal
 */
export async function updateOwnerPassword(newPassword: string): Promise<void> {
  const newSaltBytes = new Uint8Array(16);
  window.crypto.getRandomValues(newSaltBytes);
  const newSalt = Array.from(newSaltBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const newHash = await computeSha256(newSalt, newPassword);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_PASS_SALT, newSalt);
  localStorage.setItem(STORAGE_KEYS.CUSTOM_PASS_HASH, newHash);
}
