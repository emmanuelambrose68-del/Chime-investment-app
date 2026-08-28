// ======================================
// CHIME INVESTMENT - APP JAVASCRIPT
// ======================================

// Demo account balance
let balance = 5000;
let earnings = 250;

// Store demo investments during the session
let investments = [];

// Store transactions during the session
let transactions = [
    {
        title: "Welcome Bonus",
        description: "Account created",
        amount: 250,
        type: "credit",
        icon: "🎁"
    }
];


// ======================================
// TELEGRAM MINI APP
// ======================================

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    // Use Telegram's theme where available
    if (tg.setHeaderColor) {
        tg.setHeaderColor("#172033");
    }

    if (tg.setBackgroundColor) {
        tg.setBackgroundColor("#f5f6fa");
    }

    // Get Telegram user information
    const user = tg.initDataUnsafe?.user;

    if (user) {

        const fullName =
            [user.first_name, user.last_name]
                .filter(Boolean)
                .join(" ");

       
