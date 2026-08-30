/* =========================================
   CHIME INVESTMENT
   COMPLETE APP JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       TELEGRAM MINI APP
    ===================================== */

    if (window.Telegram && window.Telegram.WebApp) {

        const tg = window.Telegram.WebApp;

        tg.ready();
        tg.expand();

        if (typeof tg.setHeaderColor === "function") {
            tg.setHeaderColor("#172033");
        }

        if (typeof tg.setBackgroundColor === "function") {
            tg.setBackgroundColor("#f5f7fb");
        }

        const user =
            tg.initDataUnsafe &&
            tg.initDataUnsafe.user;

        if (user) {

            const name =
                [user.first_name, user.last_name]
                .filter(Boolean)
                .join(" ");

            const username =
                user.username
                    ? "@" + user.username
                    : "Telegram User";

            const profileName =
                document.getElementById("profileName");

            const profileUsername =
                document.getElementById("profileUsername");

            if (profileName) {
                profileName.textContent =
                    name || "Chime User";
            }

            if (profileUsername) {
                profileUsername.textContent =
                    username;
            }
        }
    }


    /* =====================================
       PAGE NAVIGATION
    ===================================== */

    window.showPage = function (pageId) {

        const pages =
            document.querySelectorAll(".page");

        pages.forEach(function (page) {
            page.classList.remove("active");
        });

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {
            console.warn("Page not found:", pageId);
            return;
        }

        selectedPage.classList.add("active");

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


    /* =====================================
       INVESTMENT PLAN
    ===================================== */

    window.selectPlan = function (
        plan,
        minimum,
        maximum,
        percentage,
        days
    ) {

        const amount = prompt(
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

        const investment = Number(amount);

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

        if (existingCapital + investment > 2000) {

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
            JSON.stringify(investmentData)
        );

        localStorage.setItem(
            "chimeInvestedCapital",
            String(
                existingCapital + investment
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
            "Target return: " +
            percentage +
            "%\n" +
            "Cycle: " +
            days +
            " days."
        );

        showPage("dashboard");
    };


    /* =====================================
       DASHBOARD
    ===================================== */

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


    /* =====================================
       ACTIVE INVESTMENT
    ===================================== */

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


    /* =====================================
       7-DAY TIMER
    ===================================== */

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


    /* =====================================
       WEEKEND DEPOSIT NOTICE
    ===================================== */

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

        const today =
            new Date().getDay();

        if (
            today === 0 ||
            today === 6
        ) {

            title.textContent =
                "🟢 Deposits are currently available";

            text.textContent =
                "Crypto deposits are available this weekend. You can submit your deposit during the weekend deposit period.";

        } else {

            title.textContent =
                "🔴 Deposits are currently closed";

            text.textContent =
                "Crypto deposits are available only on weekends. Deposit services will reopen this weekend.";
        }
    }


    /* =====================================
       CRYPTO DEPOSIT
    ===================================== */

    window.makeDeposit = function () {

        const today =
            new Date().getDay();

        if (
            today !== 0 &&
            today !== 6
        ) {

            alert(
                "Crypto deposits are currently closed. Deposits are available only on weekends."
            );

            return;
        }

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
            amount.toLocaleString() +
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


    /* =====================================
       WITHDRAWAL
    ===================================== */

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
            amount.toLocaleString() +
            "\n\n" +
            "Your request has been recorded."
        );

        input.value = "";

        if (destination) {
            destination.value = "";
        }
    };


    /* =====================================
       DARK MODE
    ===================================== */

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


    /* =====================================
       LOAD DARK MODE
    ===================================== */

    if (
        localStorage.getItem(
            "chimeDarkMode"
        ) === "on"
    ) {

        document.body.classList.add(
            "dark-mode"
        );
    }


    /* =====================================
       INITIALIZE
    ===================================== */

    updateThemeStatus();

    updateDashboard();

    updateWeekendDepositNotice();


    /* =====================================
       LIVE TIMER
    ===================================== */

    setInterval(
        updateInvestmentTimer,
        1000
    );


    /* =====================================
       WEEKEND CHECK
    ===================================== */

    setInterval(
        updateWeekendDepositNotice,
        60000
    );


    console.log(
        "Chime Investment loaded successfully."
    );

});
/* =========================================
   CHIME — ACCOUNT DETAILS
========================================= */

(function () {

    function loadAccountDetails() {

        const email =
            localStorage.getItem("chimeEmail");

        const emailElement =
            document.getElementById("accountEmail");

        if (emailElement) {
            emailElement.textContent =
                email || "Not added";
        }


        const telegramElement =
            document.getElementById("accountTelegram");

        if (
            window.Telegram &&
            window.Telegram.WebApp
        ) {

            const tg =
                window.Telegram.WebApp;

            const user =
                tg.initDataUnsafe &&
                tg.initDataUnsafe.user;

            if (telegramElement && user) {

                telegramElement.textContent =
                    user.username
                        ? "@" + user.username
                        : "Telegram User";

            }
        }


        const securityElement =
            document.getElementById("accountSecurity");

        if (securityElement) {

            securityElement.textContent =
                "Active";

        }


        const createdElement =
            document.getElementById("accountCreated");

        if (createdElement) {

            let created =
                localStorage.getItem(
                    "chimeAccountCreated"
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
                    "chimeAccountCreated",
                    created
                );

            }

            createdElement.textContent =
                created;

        }

    }


    document.addEventListener(
        "DOMContentLoaded",
        loadAccountDetails
    );


    window.loadAccountDetails =
        loadAccountDetails;

})();
/* =========================================
   CHIME ACCOUNT DETAILS
========================================= */

function updateAccountDetails() {

    /* Telegram username */

    const telegramElement =
        document.getElementById("accountTelegram");

    if (
        window.Telegram &&
        window.Telegram.WebApp
    ) {

        const user =
            window.Telegram.WebApp
                .initDataUnsafe
                .user;

        if (telegramElement && user) {

            telegramElement.textContent =
                user.username
                    ? "@" + user.username
                    : "Telegram User";

        }
    }


    /* Account creation date */

    const createdElement =
        document.getElementById("accountCreated");

    if (createdElement) {

        let created =
            localStorage.getItem(
                "chimeAccountCreated"
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
                "chimeAccountCreated",
                created
            );
        }

        createdElement.textContent =
            created;
    }


    /* Security status */

    const securityElement =
        document.getElementById("accountSecurity");

    if (securityElement) {

        securityElement.textContent =
            "Active";

    }
}


/* Run when app loads */

document.addEventListener(
    "DOMContentLoaded",
    updateAccountDetails
);
