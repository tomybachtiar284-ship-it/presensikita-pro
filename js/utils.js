
export const calculateTenure = (joinDateStr) => {
    const joinDate = new Date(joinDateStr);
    const now = new Date();
    let years = now.getFullYear() - joinDate.getFullYear();
    let months = now.getMonth() - joinDate.getMonth();
    if (months < 0 || (months === 0 && now.getDate() < joinDate.getDate())) {
        years--;
        months += 12;
    }
    return `${years} th ${months} bln`;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
};

export const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export const getShiftGroup = (dateObj, shiftIndex) => {
    // 1. Check for overrides in LocalStorage
    // Key format: YYYY-M-D-ShiftIndex (e.g. 2024-9-15-0)
    // Note: getMonth() is 0-indexed
    const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}-${shiftIndex}`;

    // Parse overrides from LS
    let overrides = {};
    try {
        overrides = JSON.parse(localStorage.getItem('SCHEDULE_OVERRIDES') || '{}');
    } catch (e) {
        overrides = {};
    }

    if (overrides[dateKey]) {
        return overrides[dateKey];
    }

    // 2. Default Matrix Logic (Diagonal Rotation)
    // Shift offsets: Pagi(0)=0, Malam(1)=1, Sore(2)=2, Libur(3)=3
    const groups = ['A', 'B', 'C', 'D'];
    const baseIndex = (dateObj.getDate() - 1) % 4; // Day 1 = Index 0
    const groupIndex = (baseIndex + shiftIndex) % 4;
    return groups[groupIndex];
};
