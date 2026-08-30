/* =========================================
   CHIME INVESTMENT
   APP JAVASCRIPT
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
            tg.setHeaderColor("#ffffff");
        }

        if (typeof tg.setBackgroundColor === "function") {
            tg.setBackgroundColor("#f5f8f6");
        }

        /* Telegram User */

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
                    name || "Chime Investor";
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

        /* Hide every page */

        pages.forEach(function (page) {
            page.classList.remove("active");
        });


        /* Find selected page */

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {

            console.warn(
                "Chime: Page not found:",
                pageId
            );

            return;
        }


        /* Show selected page */

        selectedPage.classList.add("active");


        /* =================================
           BOTTOM NAVIGATION
        ================================= */

        const navItems =
            document.querySelectorAll(".nav-item");


        navItems.forEach(function (item) {
            item.classList.remove("active");
        });


        /* Match page to bottom navigation */

        let navIndex = -1;

        if (pageId === "dashboard") {
            navIndex = 0;
        }

        else if (pageId === "investments") {
            navIndex = 1;
        }

        else if (pageId === "transactions") {
            navIndex = 2;
        }

        else if (pageId === "profile") {
            navIndex = 3;
        }


        if (navIndex >= 0 && navItems[navIndex]) {

            navItems[navIndex]
                .classList.add("active");

        }


        /* Scroll to top */

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
        amount,
        percentage,
        duration
    ) {

        const formattedAmount =
            Number(amount).toLocaleString();

        const message =
            "Investment Plan\n\n" +
            plan + "\n\n" +
            "Minimum: ₦" +
            formattedAmount + "\n" +
            "Return: " +
            percentage +
            "%\n" +
            "Duration: " +
            duration +
            " Days\n\n" +
            "This is currently a demo.";

        alert(message);
    };


    /* =====================================
       DEPOSIT
    ===================================== */

    window.makeDeposit = function () {

        const input =
            document.getElementById(
                "depositAmount"
            );

        if (!input) {
            return;
        }

        const amount =
            Number(input.value);

        if (!amount || amount <= 0) {

            alert(
                "Please enter a valid deposit amount."
            );

            return;
        }


        alert(
            "Deposit request received.\n\n" +
            "Amount: ₦" +
            amount.toLocaleString() +
            "\n\n" +
            "Demo mode: no real payment was made."
        );


        input.value = "";
    };


    /* =====================================
       WITHDRAW
    ===================================== */

    window.makeWithdrawal = function () {

        const input =
            document.getElementById(
                "withdrawAmount"
            );

        if (!input) {
            return;
        }

        const amount =
            Number(input.value);

        if (!amount || amount <= 0) {

            alert(
                "Please enter a valid withdrawal amount."
            );

            return;
        }


        const account =
            document.getElementById(
                "bankAccount"
            );

        const bank =
            document.getElementById(
                "bankName"
            );


        if (
            account &&
            account.value.trim() === ""
        ) {

            alert(
                "Please enter your bank account number."
            );

            return;
        }


        if (
            bank &&
            bank.value.trim() === ""
        ) {

            alert(
                "Please enter your bank name."
            );

            return;
        }


        alert(
            "Withdrawal request received.\n\n" +
            "Amount: ₦" +
            amount.toLocaleString() +
            "\n\n" +
            "Demo mode: no real withdrawal was made."
        );


        input.value = "";

        if (account) {
            account.value = "";
        }

        if (bank) {
            bank.value = "";
        }
    };


    /* =====================================
       TELEGRAM BACK BUTTON
    ===================================== */

    if (
        window.Telegram &&
        window.Telegram.WebApp
    ) {

        const tg =
            window.Telegram.WebApp;

        if (
            tg.BackButton &&
            typeof tg.BackButton.onClick === "function"
        ) {

            tg.BackButton.onClick(function () {

                showPage("dashboard");

                if (
                    typeof tg.BackButton.hide ===
                    "function"
                ) {
                    tg.BackButton.hide();
                }

            });
        }
    }


    /* =====================================
       INITIAL PAGE
    ===================================== */

    showPage("welcome");


    console.log(
        "Chime Investment loaded successfully."
    );

});
