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

            console.warn(
                "Page not found:",
                pageId
            );

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


        if (
            navigation[pageId] !== undefined
        ) {

            const navItem =
                navItems[
                    navigation[pageId]
                ];

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
            existingCapital + investment > 2000
        ) {

            alert(
                "Your maximum total investment capital is $2,000."
            );

            return;

        }


        const return
