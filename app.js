/* =========================================
   CHIME INVESTMENT
   CLEAN COMPLETE APP JAVASCRIPT
========================================= */


/* =========================================
   PAGE NAVIGATION
========================================= */
window.showPage = function (pageId) {

    const pages = document.querySelectorAll(".page");

    /* Hide EVERY page first */
    pages.forEach(function (page) {
        page.classList.remove("active");
    });

    /* Find the page selected */
    const selectedPage =
        document.getElementById(pageId);

    if (!selectedPage) {
        console.warn("Page not found:", pageId);
        return;
    }

    /* Show ONLY selected page */
    selectedPage.classList.add("active");

    /* Update bottom navigation */
    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {
        item.classList.remove("active");
    });

    const navigation = {
        dashboard: 0,
        investments: 1,
        transactions: 2,
        profile: 3
    };

    if (navigation[pageId] !== undefined) {

        const navItem =
            navItems[navigation[pageId]];

        if (navItem) {
            navItem.classList.add("active");
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

/* =========================================
   TELEGRAM MINI APP
========================================= */

function loadTelegramUser() {

    try {

        if (
            window.Telegram &&
            window.Telegram.WebApp
        ) {

            const tg =
                window.Telegram.WebApp;

            tg.ready();
            tg.expand();

            if (
                typeof tg.setHeaderColor ===
                "function"
            ) {

                tg.setHeaderColor("#172033");

            }

            if (
                typeof tg.setBackgroundColor ===
                "function"
            ) {

                tg.setBackgroundColor("#f5f7fb");

            }

            const user =
                tg.initDataUnsafe &&
                tg.initDataUnsafe.user;

            if (!user) {
                return;
            }

            const name =
                [user.first_name, user.last_name]
                .filter(Boolean)
                .join(" ");

            const username =
                user.username
                    ? "@" + user.username
                    : "Telegram User";


            const profileName =
                document.getElementById(
                    "profileName"
                );

            const profileUsername =
                document.getElementById(
                    "profileUsername"
                );

            const telegramInput =
                document.getElementById(
                    "signupTelegram"
                );

            const accountTelegram =
                document.getElementById(
                    "accountTelegram"
                );


            if (profileName) {

                profileName.textContent =
                    localStorage.getItem(
                        "chimeName"
                    ) || name || "Chime User";

            }


            if (profileUsername) {

                profileUsername.textContent =
                    username;

            }


            if (telegramInput) {

                telegramInput.value =
                    username;

            }


            if (accountTelegram) {

                accountTelegram.textContent =
                    username;

            }

        }

    } catch (error) {

        console.log(
            "Telegram information unavailable."
        );

    }
}


/* =========================================
   INVESTMENT PLAN
========================================= */

window.selectPlan = function (
    plan,
    minimum,
    maximum,
    percentage,
    days
) {

    const amount =
        prompt(
            plan +
            "\n\nInvestment range: $" +
            minimum.toLocaleString() +
            " - $" +
            maximum.toLocaleString() +
            "\n\nTarget return: " +
            percentage +
            "% every " +
            days +
            " days." +
            "\n\nEnter your investment amount:"
        );

    if (amount === null) {
        return;
    }

    const investment =
        Number(amount);

    if (
        !Number.isFinite(investment) ||
        investment < minimum ||
        investment > maximum
    ) {

        alert(
            "Please enter an amount between $" +
            minimum.toLocaleString() +
            " and $" +
            maximum.toLocaleString() +
            "."
        );

        return;
    }


    const existingCapital =
        Number(
            localStorage.getItem(
                "chimeInvestedCapital"
            ) || 0
        );


    if (
        existingCapital +
        investment >
        2000
    ) {

        alert(
            "Your maximum total investment capital is $2,000."
        );

        return;
    }


    const returnAmount =
        investment *
        percentage /
        100;


    const startTime =
        Date.now();


    const endTime =
        startTime +
        days *
        24 *
        60 *
        60 *
        1000;


    const investmentData = {

        plan: plan,

        capital: investment,

        percentage: percentage,

        returnAmount: returnAmount,

        startTime: startTime,

        endTime: endTime

    };


    localStorage.setItem(
        "chimeInvestment",
        JSON.stringify(
            investmentData
        )
    );


    localStorage.setItem(
        "chimeInvestedCapital",
        String(
            existingCapital +
            investment
        )
    );


    updateDashboard();


    alert(
        "Investment created successfully.\n\n" +
        "Plan: " +
        plan +
        "\n" +
        "Capital: $" +
        investment.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) +
        "\n" +
        "Cycle: " +
        days +
        " days."
    );


    showPage("dashboard");

};


/* =========================================
   DASHBOARD
========================================= */

function updateDashboard() {

    const investment =
        JSON.parse(
            localStorage.getItem(
                "chimeInvestment"
            )
        );


    const investedCapital =
        Number(
            localStorage.getItem(
                "chimeInvestedCapital"
            ) || 0
        );


    const totalBalance =
        document.getElementById(
            "totalBalance"
        );


    const investedAmount =
        document.getElementById(
            "investedAmount"
        );


    const profitAmount =
        document.getElementById(
            "profitAmount"
        );


    if (totalBalance) {

        totalBalance.textContent =
            "$" +
            investedCapital.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    if (investedAmount) {

        investedAmount.textContent =
            "$" +
            investedCapital.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    if (profitAmount) {

        const profit =
            investment
                ? investment.returnAmount
                : 0;

        profitAmount.textContent =
            "$" +
            profit.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    updateActiveInvestment();

}


/* =========================================
   ACTIVE INVESTMENT
========================================= */

function updateActiveInvestment() {

    const card =
        document.getElementById(
            "activeInvestmentCard"
        );


    const investment =
        JSON.parse(
            localStorage.getItem(
                "chimeInvestment"
            )
        );


    if (!card || !investment) {

        if (card) {
            card.style.display = "none";
        }

        return;
    }


    card.style.display = "block";


    const planName =
        document.getElementById(
            "activePlanName"
        );


    const capital =
        document.getElementById(
            "activeCapital"
        );


    const returnValue =
        document.getElementById(
            "activeReturn"
        );


    const endDate =
        document.getElementById(
            "investmentEndDate"
        );


    if (planName) {

        planName.textContent =
            investment.plan;

    }


    if (capital) {

        capital.textContent =
            "$" +
            investment.capital.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    if (returnValue) {

        returnValue.textContent =
            "$" +
            investment.returnAmount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );

    }


    if (endDate) {

        endDate.textContent =
            "Cycle ends: " +
            new Date(
                investment.endTime
            ).toLocaleString();

    }


    updateInvestmentTimer();

}


/* =========================================
   INVESTMENT CYCLE TIMER
========================================= */

function updateInvestmentTimer() {

    const timer =
        document.getElementById(
            "investmentTimer"
        );


    const investment =
        JSON.parse(
            localStorage.getItem(
                "chimeInvestment"
            )
        );


    if (!timer || !investment) {
        return;
    }


    const remaining =
        investment.endTime -
        Date.now();


    if (remaining <= 0) {

        timer.textContent =
            "00d 00h 00m 00s";

        return;
    }


    const days =
        Math.floor(
            remaining /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                remaining %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                remaining %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                remaining %
                (1000 * 60)
            ) /
            1000
        );


    timer.textContent =
        String(days).padStart(2, "0") +
        "d " +
        String(hours).padStart(2, "0") +
        "h " +
        String(minutes).padStart(2, "0") +
        "m " +
        String(seconds).padStart(2, "0") +
        "s";

}


/* =========================================
   CRYPTO DEPOSIT
   AVAILABLE EVERY DAY
========================================= */

window.makeDeposit = function () {

    const amountInput =
        document.getElementById(
            "depositAmount"
        );


    const currency =
        document.getElementById(
            "cryptoCurrency"
        );


    const network =
        document.getElementById(
            "cryptoNetwork"
        );


    if (!amountInput) {
        return;
    }


    const amount =
        Number(
            amountInput.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid deposit amount."
        );

        return;
    }


    alert(
        "Deposit request received.\n\n" +
        "Amount: $" +
        amount.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) +
        "\n" +
        "Crypto: " +
        (
            currency
                ? currency.value
                : "USDT"
        ) +
        "\n" +
        "Network: " +
        (
            network
                ? network.value
                : "TRC20"
        )
    );


    amountInput.value = "";

};


/* =========================================
   DEPOSIT NOTICE
   NO WEEKEND RESTRICTION
========================================= */

function updateWeekendDepositNotice() {

    const title =
        document.getElementById(
            "depositNoticeTitle"
        );


    const text =
        document.getElementById(
            "depositNoticeText"
        );


    if (!title || !text) {
        return;
    }


    title.textContent =
        "🟢 Deposits are currently available";


    text.textContent =
        "Crypto deposits are available. You can submit your deposit at any time.";

}


/* =========================================
   WITHDRAWAL
========================================= */

window.makeWithdrawal = function () {

    const input =
        document.getElementById(
            "withdrawAmount"
        );


    const destination =
        document.getElementById(
            "bankAccount"
        );


    if (!input) {
        return;
    }


    const amount =
        Number(
            input.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid withdrawal amount."
        );

        return;
    }


    if (
        !destination ||
        !destination.value.trim()
    ) {

        alert(
            "Please enter your destination details."
        );

        return;
    }


    alert(
        "Withdrawal request received.\n\n" +
        "Amount: $" +
        amount.toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        ) +
        "\n\n" +
        "Your request has been recorded."
    );


    input.value = "";


    if (destination) {
        destination.value = "";
    }

};


/* =========================================
   DARK MODE
========================================= */

window.toggleDarkMode = function () {

    document.body.classList.toggle(
        "dark-mode"
    );


    const darkMode =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "chimeDarkMode",
        darkMode
            ? "on"
            : "off"
    );


    updateThemeStatus();

};


function updateThemeStatus() {

    const status =
        document.getElementById(
            "themeStatus"
        );


    if (!status) {
        return;
    }


    const darkMode =
        document.body.classList.contains(
            "dark-mode"
        );


    status.textContent =
        darkMode
            ? "On"
            : "Off";

}


/* =========================================
   ACCOUNT DETAILS
========================================= */

function updateAccountDetails() {

    const email =
        localStorage.getItem(
            "chimeEmail"
        );


    const emailElement =
        document.getElementById(
            "accountEmail"
        );


    if (emailElement) {

        emailElement.textContent =
            email || "Not added";

    }


    const createdElement =
        document.getElementById(
            "accountCreated"
        );


    if (createdElement) {

        let created =
            localStorage.getItem(
                "chimeAccountDate"
            );


        if (!created) {

            created =
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );


            localStorage.setItem(
                "chimeAccountDate",
                created
            );

        }


        createdElement.textContent =
            created;

    }


    const securityElement =
        document.getElementById(
            "accountSecurity"
        );


    if (securityElement) {

        securityElement.textContent =
            "Active";

    }


    loadTelegramUser();

}


/* =========================================
   CREATE ACCOUNT
========================================= */

window.createChimeAccount = function () {

    const name =
        document.getElementById(
            "signupName"
        ).value.trim();


    const email =
        document.getElementById(
            "signupEmail"
        ).value.trim();


    const password =
        document.getElementById(
            "signupPassword"
        ).value;


    const confirmPassword =
        document.getElementById(
            "signupConfirmPassword"
        ).value;


    const terms =
        document.getElementById(
            "signupTerms"
        ).checked;


    const message =
        document.getElementById(
            "signupMessage"
        );


    if (!name) {

        message.textContent =
            "Please enter your full name.";

        return;
    }


    if (
        !email ||
        !email.includes("@")
    ) {

        message.textContent =
            "Please enter a valid email address.";

        return;
    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;
    }


    if (
        password !==
        confirmPassword
    ) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    if (!terms) {

        message.textContent =
            "Please accept the applicable terms.";

        return;
    }


    const accountDate =
        new Date().toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );


    localStorage.setItem(
        "chimeHasEnteredApp",
        "true"
    );


    localStorage.setItem(
        "chimeName",
        name
    );


    localStorage.setItem(
        "chimeUserName",
        name
    );


    localStorage.setItem(
        "chimeEmail",
        email
    );


    localStorage.setItem(
        "chimeAccountDate",
        accountDate
    );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const accountEmail =
        document.getElementById(
            "accountEmail"
        );


    const accountCreated =
        document.getElementById(
            "accountCreated"
        );


    if (profileName) {
        profileName.textContent = name;
    }


    if (accountEmail) {
        accountEmail.textContent = email;
    }


    if (accountCreated) {
        accountCreated.textContent =
            accountDate;
    }


    message.textContent =
        "Account created successfully.";


    setTimeout(function () {

        showPage("dashboard");

    }, 600);

};


/* =========================================
   LOGOUT
========================================= */

window.logoutChime = function () {

    const confirmLogout =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmLogout) {
        return;
    }


    /* Clear login status */

    localStorage.removeItem(
        "chimeHasEnteredApp"
    );


    /* Return to welcome */

    showPage("welcome");

};


/* =========================================
   INITIAL STARTING PAGE
========================================= */

function initializeStartingPage() {

    const registered =
        localStorage.getItem(
            "chimeHasEnteredApp"
        );


    if (registered === "true") {

        showPage("dashboard");

    } else {

        showPage("welcome");

    }

}


/* =========================================
   APP INITIALIZATION
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Telegram */

        loadTelegramUser();


        /* Dark mode */

        if (
            localStorage.getItem(
                "chimeDarkMode"
            ) === "on"
        ) {

            document.body.classList.add(
                "dark-mode"
            );

        }


        updateThemeStatus();


        /* Account */

        updateAccountDetails();


        /* Dashboard */

        updateDashboard();


        /* Deposit */

        updateWeekendDepositNotice();


        /* Starting page */

        initializeStartingPage();


        console.log(
            "Chime Investment loaded successfully."
        );

    }
);


/* =========================================
   LIVE TIMER
========================================= */

setInterval(
    updateInvestmentTimer,
    1000
);
