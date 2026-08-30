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
        tg.setHeaderColor("#172033");
    }

    if (typeof tg.setBackgroundColor === "function") {
        tg.setBackgroundColor("#f5f6fa");
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


        const userName =
            document.getElementById("userName");


        const profileName =
            document.getElementById("profileName");


        const profileUsername =
            document.getElementById("profileUsername");


        if (userName) {
            userName.textContent =
                name || "Chime Investor";
        }


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
   GET STARTED
===================================== */

window.enterApp = function () {

    const welcomePage =
        document.getElementById("welcomePage");


    const app =
        document.getElementById("app");


    if (welcomePage) {
        welcomePage.classList.add("hidden");
    }


    if (app) {
        app.classList.remove("hidden");
    }


    window.showPage("homePage");

};



/* =====================================
   PAGE NAVIGATION
===================================== */

window.showPage = function (pageId) {

    const pages =
        document.querySelectorAll(".app-page");


    pages.forEach(function (page) {

        page.classList.remove("active-page");

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


    selectedPage.classList.add("active-page");



    /* Bottom navigation */

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


    if (
        navigation[pageId] !== undefined
    ) {

        const navItem =
            navItems[
                navigation[pageId]
            ];


        if (navItem) {

            navItem.classList.add(
                "active-nav"
            );

        }

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};



/* =====================================
   DEPOSIT MODAL
===================================== */

window.openDeposit = function () {

    const modal =
        document.getElementById(
            "depositModal"
        );


    if (!modal) {
        return;
    }


    modal.style.display = "flex";


    const input =
        document.getElementById(
            "depositAmount"
        );


    if (input) {

        input.value = "";

        setTimeout(function () {

            input.focus();

        }, 150);

    }

};



/* =====================================
   WITHDRAW MODAL
===================================== */

window.openWithdraw = function () {

    const modal =
        document.getElementById(
            "withdrawModal"
        );


    if (!modal) {
        return;
    }


    modal.style.display = "flex";


    const input =
        document.getElementById(
            "withdrawAmount"
        );


    if (input) {

        input.value = "";

        setTimeout(function () {

            input.focus();

        }, 150);

    }

};



/* =====================================
   CLOSE MODALS
===================================== */

window.closeModals = function () {

    const deposit =
        document.getElementById(
            "depositModal"
        );


    const withdraw =
        document.getElementById(
            "withdrawModal"
        );


    if (deposit) {

        deposit.style.display =
            "none";

    }


    if (withdraw) {

        withdraw.style.display =
            "none";

    }

};



/* =====================================
   INVESTMENT PLAN
===================================== */

window.invest = function (
    plan,
    amount
) {

    const formattedAmount =
        Number(amount).toLocaleString();


    alert(
        plan +
        "\n\n" +
        "Minimum investment: ₦" +
        formattedAmount +
        "\n\n" +
        "This is currently a demo."
    );

};



/* =====================================
   DEPOSIT
===================================== */

window.deposit = function () {

    const input =
        document.getElementById(
            "depositAmount"
        );


    if (!input) {
        return;
    }


    const amount =
        Number(input.value);


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;
    }


    closeModals();


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

window.withdraw = function () {

    const input =
        document.getElementById(
            "withdrawAmount"
        );


    if (!input) {
        return;
    }


    const amount =
        Number(input.value);


    if (
        !amount ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;
    }


    closeModals();


    alert(
        "Withdrawal request received.\n\n" +
        "Amount: ₦" +
        amount.toLocaleString() +
        "\n\n" +
        "Demo mode: no real withdrawal was made."
    );


    input.value = "";

};



/* =====================================
   ESC KEY
===================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModals();

        }

    }
);



/* =====================================
   INITIAL STATE
===================================== */

const welcomePage =
    document.getElementById(
        "welcomePage"
    );


const app =
    document.getElementById("app");


if (welcomePage) {

    welcomePage.classList.remove(
        "hidden"
    );

}


if (app) {

    app.classList.add("hidden");

}


console.log(
    "Chime Investment loaded successfully."
);

});
