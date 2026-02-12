document.addEventListener('DOMContentLoaded', () => {
    // 1. Personalization: Welcome Message
    updateGreeting();
});

function updateGreeting() {
    const usernameEl = document.getElementById('username');
    if (!usernameEl) return;

    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        // Use global_name if available, otherwise username
        const name = user.global_name || user.username || 'User';
        usernameEl.textContent = name;
    } else {
        usernameEl.textContent = 'Guest';
    }
}
