/* =========================================
   CHIME INVESTMENT
   APP JAVASCRIPT
   Works on GitHub Pages + Telegram
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

        pages.forEach(function (page) {
            page.classList.remove("active");
        });

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {
            console.warn(
                "Chime: Page not found:",
                pageId
            );
            return;
        }

        selectedPage.classList.add("active");


        /* Update bottom navigation */

        const navItems =
            document.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {
            item.classList.remove("active");
        });


        let navIndex = -1;

        switch (pageId) {

            case "dashboard":
                navIndex = 0;
                break;

            case "investments":
                navIndex = 1;
                break;

            case "transactions":
                navIndex = 2;
                break;

            case "profile":
                navIndex = 3;
                break;
        }


        if (
            navIndex !== -1 &&
            navItems[navIndex]
        ) {
            navItems[navIndex]
                .classList.add("active");
        }


        window.scrollTo(0, 0);
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

        alert(
            plan +
            "\n\n" +
            "Minimum investment: ₦" +
            formattedAmount +
            "\n" +
            "Expected return: " +
            percentage +
            "%\n" +
            "Duration: " +
            duration +
            " Days\n\n" +
            "Demo mode: no real investment was made."
        );
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
       INITIAL PAGE
    ===================================== */

    showPage("welcome");


    console.log(
        "Chime Investment loaded successfully."
    );

});
