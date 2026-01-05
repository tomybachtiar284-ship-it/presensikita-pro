
import { getUsers } from './data.js';

const STORAGE_KEY = 'presensi_user';

export const login = (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    // Allow 'password123' as universal fallback for demo purposes or check actual password
    if (user && (password === user.password || password === 'password123')) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, message: 'Email atau password salah.' };
};

export const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = 'index.html';
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem(STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
};

export const requireAuth = () => {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return null; // Return null to indicate no user
    }
    return user;
};

// For index.html, check if already logged in
export const checkAuthAndRedirect = () => {
    const user = getCurrentUser();
    if (user) {
        window.location.href = 'dashboard.html';
    }
};
