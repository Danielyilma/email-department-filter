export const  formatTimestamp = (timestamp: any) => {
    return new Date(timestamp).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // second: "2-digit",
        // hour12: true,
        // timeZoneName: "short", // Optional: Displays the timezone
    });
}

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token');
};
