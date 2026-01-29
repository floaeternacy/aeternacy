
/**
 * æternacy™ Archival Date Formatter
 * Standardizes dates into a consistent high-fidelity format: DD. MMMM YYYY (e.g., 08. JANUARY 2026)
 */
export const formatArchivalDate = (dateInput: string | Date | number): string => {
    if (dateInput === 'Synthesized' || dateInput === 'Full Journey') return dateInput.toString().toUpperCase();
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return dateInput.toString().toUpperCase();

    const day = date.getDate().toString().padStart(2, '0');
    const months = [
        'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
        'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}. ${month} ${year}`;
};
