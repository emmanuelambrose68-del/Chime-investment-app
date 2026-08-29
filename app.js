// CHIME INVESTMENT APP

document.addEventListener("DOMContentLoaded", function () {

    const welcomePage = document.getElementById("welcomePage");
    const app = document.getElementById("app");

    // Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;

        tg.ready();
        tg.expand();

        if (tg.setHeaderColor) {
            tg.setHeaderColor("#111827");
        }

        if (tg.setBackgroundColor) {
            tg.setBackgroundColor("#f5f6fa");
        }

        const user = tg.initDataUnsafe &&
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

            const userName =
                document.getElementById("userName");

            const profileName =
                document.getElementById("profileName");

            const profileUsername =
                document.getElementById("profileUsername");

            if (userName) {
                userName.textContent = name || "Investor";
            }

            if (profileName) {
                profileName.textContent = name || "Investor";
            }

            if (profileUsername) {
                profileUsername.textContent = username;
            }
        }
    }


    // GET STARTED
    window.enterApp = function () {

        if (welcomePage) {
            welcomePage.classList.add("hidden");
        }

        if (app) {
            app.classList.remove("hidden");
        }

        window.showPage("homePage");
    };


    // PAGE NAVIGATION
    window.showPage = function (pageId) {

        const pages =
            document.querySelectorAll(".app-page");

        pages.forEach(function (page) {
            page.classList.remove("active-page");
        });

        const selected =
            document.getElementById(pageId);

        if (selected) {
            selected.classList.add("active-page");
        }


        // Bottom navigation
        const navItems =
            document.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {
            item.classList.remove("active-nav");
        });


        const navigation = {
            homePage: 0,
            plansPage: 1,
            investmentsPage: 2,
            transactionsPage: 3,
            profilePage: 4
        };


        if (navigation[pageId] !== undefined) {

            const item =
                navItems[navigation[pageId]];

            if (item) {
                item.classList.add("active-nav");
            }
        }


        window.scrollTo(0, 0);
    };


    // DEPOSIT
    window.openDeposit = function () {

        const modal =
            document.getElementById("depositModal");

        if (modal) {
            modal.style.display = "flex";
        }
    };


    // WITHDRAW
    window.openWithdraw = function () {

        const modal =
            document.getElementById("withdrawModal");

        if (modal) {
            modal.style.display = "flex";
        }
    };


    // CLOSE MODALS
    window.closeModals = function () {

        const deposit =
            document.getElementById("depositModal");

        const withdraw =
            document.getElementById("withdrawModal");

        if (deposit) {
            deposit.style.display = "none";
        }

        if (withdraw) {
            withdraw.style.display = "none";
        }
    };


    // INVEST
    window.invest = function (plan, amount) {

        alert(
            plan +
            "\n\nMinimum investment: ₦" +
            Number(amount).toLocaleString()
        );
    };


    // DEPOSIT DEMO
    window.deposit = function () {

        const input =
            document.getElementById("depositAmount");

        const amount =
            Number(input ? input.value : 0);

        if (!amount || amount <= 0) {

            alert("Enter a valid amount.");

            return;
        }

        window.closeModals();

        alert(
            "Deposit request received.\n\n" +
            "Amount: ₦" +
            amount.toLocaleString()
        );
    };


    // WITHDRAW DEMO
    window.withdraw = function () {

        const input =
            document.getElementById("withdrawAmount");

        const amount =
            Number(input ? input.value : 0);

        if (!amount || amount <= 0) {

            alert("Enter a valid amount.");

            return;
        }

        window.closeModals();

        alert(
            "Withdrawal request received.\n\n" +
            "Amount: ₦" +
            amount.toLocaleString()
        );
    };


    console.log("Chime Investment loaded successfully");

});
