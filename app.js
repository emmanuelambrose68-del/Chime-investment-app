document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       CHIME ACCOUNT
    ===================================== */

    let account = JSON.parse(
        localStorage.getItem("chimeAccount")
    ) || {
        balance: 0,
        invested: 0,
        profit: 0,
        investments: [],
        transactions: []
    };


    /* =====================================
       SAVE
    ===================================== */

    function saveAccount() {
        localStorage.setItem(
            "chimeAccount",
            JSON.stringify(account)
        );
    }


    /* =====================================
       USD FORMAT
    ===================================== */

    function money(amount) {

        return "$" + Number(amount).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }


    /* =====================================
       TELEGRAM
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
            tg.setHeaderColor("#172033");
        }

        if (
            typeof tg.setBackgroundColor ===
            "function"
        ) {
            tg.setBackgroundColor("#f5f6fa");
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


        const page =
            document.getElementById(pageId);


        if (!page) {
            return;
        }


        page.classList.add("active");


        const navItems =
            document.querySelectorAll(".nav-item");


        navItems.forEach(function (item) {

            item.classList.remove("active");

        });


        const navMap = {

            dashboard: 0,

            investments: 1,

            transactions: 2,

            profile: 3

        };


        if (
            navMap[pageId] !== undefined
        ) {

            const item =
                navItems[navMap[pageId]];


            if (item) {
                item.classList.add("active");
            }

        }


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    /* =====================================
       DASHBOARD
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

        updateActiveInvestment();

    }


    /* =====================================
       INVESTMENT PLANS
    ===================================== */

    window.selectPlan = function (
        plan,
        minimum,
        maximum,
        percentage,
        days
    ) {

        const entered =
            prompt(
                plan +
                "\n\nInvestment range: " +
                money(minimum) +
                " - " +
                money(maximum) +
                "\n\nReturn: " +
                percentage +
                "%" +
                "\n\nCycle: " +
                days +
                " days" +
                "\n\nEnter investment amount:"
            );


        if (entered === null) {
            return;
        }


        const amount =
            Number(entered);


        if (
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;

        }


        if (
            amount < minimum ||
            amount > maximum
        ) {

            alert(
                "This plan accepts " +
                money(minimum) +
                " to " +
                money(maximum) +
                "."
            );

            return;

        }


        if (
            amount > 2000
        ) {

            alert(
                "Maximum capital is $2,000."
            );

            return;

        }


        if (
            amount > account.balance
        ) {

            alert(
                "Insufficient available balance.\n\n" +
                "Available: " +
                money(account.balance)
            );

            return;

        }


        const targetReturn =
            amount *
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


        const investment = {

            id: Date.now(),

            plan: plan,

            capital: amount,

            targetReturn: targetReturn,

            percentage: percentage,

            duration: days,

            startTime: startTime,

            endTime: endTime,

            status: "active"

        };


        account.balance -= amount;

        account.invested += amount;

        account.profit += targetReturn;


        account.investments.push(
            investment
        );


        account.transactions.unshift({

            type: "Investment",

            plan: plan,

            amount: amount,

            profit: targetReturn,

            date:
                new Date().toLocaleString(
                    "en-US"
                ),

            status: "Active"

        });


        saveAccount();

        updateDashboard();


        alert(
            "Investment created.\n\n" +
            "Plan: " + plan +
            "\nCapital: " +
            money(amount) +
            "\nTarget return: " +
            money(targetReturn) +
            "\nCycle: " +
            days +
            " days"
        );


        showPage("dashboard");

    };


    /* =====================================
       ACTIVE INVESTMENT
    ===================================== */

    function updateActiveInvestment() {

        const card =
            document.getElementById(
                "activeInvestmentCard"
            );


        if (!card) {
            return;
        }


        const active =
            account.investments.find(
                function (investment) {

                    return (
                        investment.status ===
                        "active"
                    );

                }
            );


        if (!active) {

            card.style.display =
                "none";

            return;

        }


        card.style.display =
            "block";


        const plan =
            document.getElementById(
                "activePlanName"
            );


        const capital =
            document.getElementById(
                "activeCapital"
            );


        const target =
            document.getElementById(
                "activeReturn"
            );


        const end =
            document.getElementById(
                "investmentEndDate"
            );


        if (plan) {
            plan.textContent =
                active.plan;
        }


        if (capital) {
            capital.textContent =
                money(active.capital);
        }


        if (target) {
            target.textContent =
                money(active.targetReturn);
        }


        if (end) {

            end.textContent =
                "Cycle ends: " +
                new Date(
                    active.endTime
                ).toLocaleString(
                    "en-US"
                );

        }


        updateTimer(active);

    }


    /* =====================================
       TIMER
    ===================================== */

    function updateTimer(
        investment
    ) {

        const timer =
            document.getElementById(
                "investmentTimer"
            );


        if (!timer) {
            return;
        }


        const remaining =
            investment.endTime -
            Date.now();


        if (remaining <= 0) {

            timer.textContent =
                "Cycle Completed";

            completeInvestment(
                investment
            );

            return;

        }


        const totalSeconds =
            Math.floor(
                remaining / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) /
                3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) /
                60
            );


        const seconds =
                totalSeconds % 60;


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
       COMPLETE CYCLE
    ===================================== */

    function completeInvestment(
        investment
    ) {

        if (
            investment.status !==
            "active"
        ) {
            return;
        }


        investment.status =
            "completed";


        account.transactions.unshift({

            type:
                "Cycle Completed",

            plan:
                investment.plan,

            amount:
                investment.capital,

            profit:
                investment.targetReturn,

            date:
                new Date().toLocaleString(
                    "en-US"
                ),

            status:
                "Completed"

        });


        saveAccount();

        updateTransactions();

    }


    /* =====================================
       TIMER LOOP
    ===================================== */

    setInterval(
        function () {

            const active =
                account.investments.find(
                    function (investment) {

                        return (
                            investment.status ===
                            "active"
                        );

                    }
                );


            if (active) {

                updateTimer(
                    active
                );

            }

        },
        1000
    );


    /* =====================================
       CRYPTO DEPOSIT
    ===================================== */

    window.makeDeposit =
        function () {

            const input =
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


            if (!input) {
                return;
            }


            const amount =
                Number(input.value);


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid amount."
                );

                return;

            }


            const crypto =
                currency
                    ? currency.value
                    : "USDT";


            const selectedNetwork =
                network
                    ? network.value
                    : "TRC20";


            account.transactions.unshift({

                type:
                    "Crypto Deposit",

                amount:
                    amount,

                crypto:
                    crypto,

                network:
                    selectedNetwork,

                date:
                    new Date().toLocaleString(
                        "en-US"
                    ),

                status:
                    "Pending"

            });


            saveAccount();

            updateTransactions();


            alert(
                "Deposit request created.\n\n" +
                "Asset: " +
                crypto +
                "\nNetwork: " +
                selectedNetwork +
                "\nAmount: " +
                money(amount) +
                "\n\nDeposit is currently pending."
            );


            input.value = "";

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


            const destination =
                document.getElementById(
                    "bankAccount"
                );


            if (!input) {
                return;
            }


            const amount =
                Number(input.value);


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid amount."
                );

                return;

            }


            if (
                amount >
                account.balance
            ) {

                alert(
                    "Insufficient available balance."
                );

                return;

            }


            if (
                !destination ||
                !destination.value.trim()
            ) {

                alert(
                    "Please enter your destination."
                );

                return;

            }


            account.balance -= amount;


            account.transactions.unshift({

                type:
                    "Capital Withdrawal Request",

                amount:
                    amount,

                destination:
                    destination.value,

                date:
                    new Date().toLocaleString(
                        "en-US"
                    ),

                status:
                    "Pending"

            });


            saveAccount();

            updateDashboard();


            alert(
                "Withdrawal request submitted.\n\n" +
                "Amount: " +
                money(amount) +
                "\nStatus: Pending"
            );


            input.value = "";

            destination.value = "";

        };


    /* =====================================
       TRANSACTIONS
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
            account.transactions.length ===
            0
        ) {

            list.innerHTML = `

                <div class="empty-state">

                    <span>📋</span>

                    <h3>
                        No transactions yet
                    </h3>

                    <p>
                        Your transactions will appear here.
                    </p>

                </div>

            `;

            return;

        }


        list.innerHTML = "";


        account.transactions.forEach(
            function (transaction) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "investment-card";


                item.innerHTML = `

                    <div class="investment-header">

                        <div>

                            <h3>
                                ${transaction.type}
                            </h3>

                            <span>
                                ${transaction.date}
                            </span>

                        </div>

                        <strong>
                            ${money(transaction.amount)}
                        </strong>

                    </div>


                    <div class="investment-details">

                        ${
                            transaction.plan
                            ? `
                            <p>
                                Plan:
                                <strong>
                                    ${transaction.plan}
                                </strong>
                            </p>
                            `
                            : ""
                        }


                        ${
                            transaction.profit
                            ? `
                            <p>
                                Target return:
                                <strong>
                                    ${money(
                                        transaction.profit
                                    )}
                                </strong>
                            </p>
                            `
                            : ""
                        }


                        ${
                            transaction.crypto
                            ? `
                            <p>
                                Asset:
                                <strong>
                                    ${transaction.crypto}
                                </strong>
                            </p>
                            `
                            : ""
                        }


                        ${
                            transaction.network
                            ? `
                            <p>
                                Network:
                                <strong>
                                    ${transaction.network}
                                </strong>
                            </p>
                            `
                            : ""
                        }


                        <p>
                            Status:
                            <strong>
                                ${transaction.status}
                            </strong>
                        </p>

                    </div>

                `;


                list.appendChild(item);

            }
        );

    }


    /* =====================================
       START
    ===================================== */

    updateDashboard();

    showPage("welcome");


    console.log(
        "Chime Investment loaded successfully."
    );

});
