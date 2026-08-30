/* =========================================
   CHIME INVESTMENT
   PHASE 2 - DEMO ACCOUNT SYSTEM

   Works on:
   - GitHub Pages
   - Telegram Mini App

   NOTE:
   This is FRONT-END DEMO STORAGE.
   It is NOT a real financial backend.
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       ACCOUNT DATA
    ===================================== */

    let account = JSON.parse(
        localStorage.getItem("chimeAccount")
    ) || {

        balance: 0,

        invested: 0,

        profit: 0,

        transactions: []

    };


    /* =====================================
       SAVE ACCOUNT
    ===================================== */

    function saveAccount() {

        localStorage.setItem(
            "chimeAccount",
            JSON.stringify(account)
        );

    }


    /* =====================================
       FORMAT MONEY
    ===================================== */

    function money(amount) {

        return "₦" + Number(amount).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    /* =====================================
       UPDATE DASHBOARD
    ===================================== */

    function updateDashboard() {

        const balance =
            document.getElementById(
                "totalBalance"
            );

        const invested =
            document.getElementById(
                "investedAmount"
            );

        const profit =
            document.getElementById(
                "profitAmount"
            );


        if (balance) {

            balance.textContent =
                money(account.balance);

        }


        if (invested) {

            invested.textContent =
                money(account.invested);

        }


        if (profit) {

            profit.textContent =
                money(account.profit);

        }


        updateTransactions();

    }


    /* =====================================
       TELEGRAM MINI APP
    ===================================== */

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

            tg.setHeaderColor("#ffffff");

        }


        if (
            typeof tg.setBackgroundColor ===
            "function"
        ) {

            tg.setBackgroundColor(
                "#f5f8f6"
            );

        }


        const user =
            tg.initDataUnsafe &&
            tg.initDataUnsafe.user;


        if (user) {

            const name =
                [
                    user.first_name,
                    user.last_name
                ]
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
            document.querySelectorAll(
                ".page"
            );


        pages.forEach(function (page) {

            page.classList.remove(
                "active"
            );

        });


        const selectedPage =
            document.getElementById(
                pageId
            );


        if (!selectedPage) {

            console.warn(
                "Page not found:",
                pageId
            );

            return;

        }


        selectedPage.classList.add(
            "active"
        );


        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );


        navItems.forEach(function (item) {

            item.classList.remove(
                "active"
            );

        });


        let navIndex = -1;


        if (pageId === "dashboard") {

            navIndex = 0;

        }

        else if (
            pageId === "investments"
        ) {

            navIndex = 1;

        }

        else if (
            pageId === "transactions"
        ) {

            navIndex = 2;

        }

        else if (pageId === "profile") {

            navIndex = 3;

        }


        if (
            navIndex >= 0 &&
            navItems[navIndex]
        ) {

            navItems[navIndex]
                .classList.add(
                    "active"
                );

        }


        window.scrollTo(
            0,
            0
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


        if (
            !amount ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        if (amount < 1000) {

            alert(
                "Minimum demo deposit is ₦1,000."
            );

            return;

        }


        account.balance += amount;


        account.transactions.unshift({

            type: "Deposit",

            amount: amount,

            date: new Date()
                .toLocaleString()

        });


        saveAccount();

        updateDashboard();


        alert(
            "Deposit successful!\n\n" +
            "Amount: " +
            money(amount) +
            "\n\n" +
            "This is demo mode. No real money was deposited."
        );


        input.value = "";


        showPage(
            "dashboard"
        );

    };


    /* =====================================
       INVESTMENT
    ===================================== */

    window.selectPlan = function (
        plan,
        minimum,
        percentage,
        duration
    ) {

        const amountText =
            prompt(
                plan +
                "\n\n" +
                "Minimum investment: " +
                money(minimum) +
                "\n" +
                "Expected return: " +
                percentage +
                "%\n" +
                "Duration: " +
                duration +
                " days\n\n" +
                "Enter investment amount:"
            );


        if (
            amountText === null
        ) {

            return;

        }


        const amount =
            Number(amountText);


        if (
            !amount ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid investment amount."
            );

            return;

        }


        if (
            amount < minimum
        ) {

            alert(
                "Minimum investment is " +
                money(minimum) +
                "."
            );

            return;

        }


        if (
            amount > account.balance
        ) {

            alert(
                "Insufficient balance.\n\n" +
                "Your available balance is " +
                money(account.balance) +
                "."
            );

            return;

        }


        const expectedProfit =
            amount *
            (percentage / 100);


        account.balance -= amount;

        account.invested += amount;

        account.profit +=
            expectedProfit;


        account.transactions.unshift({

            type: "Investment",

            plan: plan,

            amount: amount,

            profit: expectedProfit,

            duration: duration,

            date: new Date()
                .toLocaleString()

        });


        saveAccount();

        updateDashboard();


        alert(
            "Investment created!\n\n" +

            "Plan: " +
            plan +

            "\nAmount: " +
            money(amount) +

            "\nExpected profit: " +
            money(expectedProfit) +

            "\nDuration: " +
            duration +
            " days\n\n" +

            "Demo mode: this investment is not real."
        );


        showPage(
            "dashboard"
        );

    };


    /* =====================================
       WITHDRAWAL
    ===================================== */

    window.makeWithdrawal =
        function () {

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


            if (
                amount > account.balance
            ) {

                alert(
                    "Insufficient balance.\n\n" +
                    "Available: " +
                    money(account.balance)
                );

                return;

            }


            const accountNumber =
                document.getElementById(
                    "bankAccount"
                );


            const bankName =
                document.getElementById(
                    "bankName"
                );


            if (
                !accountNumber ||
                !accountNumber.value.trim()
            ) {

                alert(
                    "Please enter your bank account number."
                );

                return;

            }


            if (
                !bankName ||
                !bankName.value.trim()
            ) {

                alert(
                    "Please enter your bank name."
                );

                return;

            }


            account.balance -= amount;


            account.transactions.unshift({

                type: "Withdrawal",

                amount: amount,

                bank: bankName.value,

                account:
                    accountNumber.value,

                date: new Date()
                    .toLocaleString()

            });


            saveAccount();

            updateDashboard();


            alert(
                "Withdrawal request recorded.\n\n" +

                "Amount: " +
                money(amount) +

                "\n\n" +

                "Demo mode: no real money was transferred."
            );


            input.value = "";

            accountNumber.value = "";

            bankName.value = "";


            showPage(
                "dashboard"
            );

        };


    /* =====================================
       TRANSACTION HISTORY
    ===================================== */

    function updateTransactions() {

        const list =
            document.getElementById(
                "transactionList"
            );


        if (!list) {

            return;

        }


        if (
            account.transactions.length === 0
        ) {

            list.innerHTML = `

                <div class="empty-state">

                    <span>📋</span>

                    <h3>No transactions yet</h3>

                    <p>
                        Your transactions will appear here.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML = "";


        account.transactions
            .forEach(function (
                transaction
            ) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "investment-card";


                let title =
                    transaction.type;


                if (
                    transaction.plan
                ) {

                    title +=
                        " - " +
                        transaction.plan;

                }


                let extra = "";


                if (
                    transaction.profit
                ) {

                    extra =
                        "<p>Expected profit: <strong>" +
                        money(
                            transaction.profit
                        ) +
                        "</strong></p>";

                }


                item.innerHTML = `

                    <div class="investment-header">

                        <div>

                            <h3>
                                ${title}
                            </h3>

                            <span>
                                ${transaction.date}
                            </span>

                        </div>

                        <strong>
                            ${money(
                                transaction.amount
                            )}
                        </strong>

                    </div>

                    <div class="investment-details">

                        <p>
                            Type:
                            <strong>
                                ${transaction.type}
                            </strong>
                        </p>

                        ${extra}

                    </div>

                `;


                list.appendChild(
                    item
                );

            });

    }


    /* =====================================
       START APP
    ===================================== */

    updateDashboard();


    showPage(
        "welcome"
    );


    console.log(
        "Chime Investment Phase 2 loaded."
    );

});
