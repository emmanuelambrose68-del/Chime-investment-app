/* =========================================
   CHIME INVESTMENT
   FIREBASE CONNECTED APP JAVASCRIPT
   ========================================= */

(function () {

    "use strict";

    /* =========================================
       FIREBASE
    ========================================= */

    let auth = null;
    let db = null;
    let currentUser = null;

    function initializeFirebaseConnection() {

        if (!window.chimeAuth || !window.chimeDB) {

            console.error(
                "Firebase has not been initialized. Check index.html."
            );

            return false;
        }

        auth = window.chimeAuth;
        db = window.chimeDB;

        return true;
    }


    /* =========================================
       PAGE NAVIGATION
    ========================================= */

    window.showPage = function (pageId) {

        const pages =
            document.querySelectorAll(".page");

        if (!pages.length) {
            return;
        }

        pages.forEach(function (page) {

            page.classList.remove("active");
            page.style.display = "none";

        });

        const selectedPage =
            document.getElementById(pageId);

        if (!selectedPage) {
            console.warn("Page not found:", pageId);
            return;
        }

        selectedPage.classList.add("active");
        selectedPage.style.display = "block";


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


        if (pageId === "dashboard") {
            updateDashboard();
        }


        if (pageId === "profile") {
            updateAccountDetails();
        }


        if (pageId === "transactions") {
            loadTransactions();
        }

    };


    /* =========================================
       BACK BUTTON
    ========================================= */

    window.goBack = function () {
        showPage("dashboard");
    };


    /* =========================================
       TELEGRAM
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
                        ) ||
                        name ||
                        "Chime User";

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
       CREATE FIRESTORE USER PROFILE
    ========================================= */

    async function createUserProfile(
        user,
        name,
        telegramUsername
    ) {

        if (!db || !user) {
            return;
        }


        const userRef =
            db.collection("users").doc(user.uid);


        const existing =
            await userRef.get();


        if (!existing.exists) {

            await userRef.set({

                uid: user.uid,

                name: name,

                email: user.email || "",

                telegramUsername:
                    telegramUsername ||
                    "Telegram User",

                balance: 0,

                investedCapital: 0,

                totalReturns: 0,

                createdAt:
                    firebase.firestore.FieldValue
                    .serverTimestamp(),

                updatedAt:
                    firebase.firestore.FieldValue
                    .serverTimestamp()

            });

        }

    }


    /* =========================================
       SELECT INVESTMENT PLAN
    ========================================= */

    window.selectPlan = function (
        plan,
        minimum,
        maximum,
        percentage,
        days
    ) {

        if (!currentUser) {

            alert(
                "Please create or sign in to your Chime account first."
            );

            showPage("signup");

            return;
        }


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

            userId: currentUser.uid,

            plan: plan,

            capital: investment,

            percentage: percentage,

            returnAmount: returnAmount,

            days: days,

            startTime: startTime,

            endTime: endTime,

            status: "pending",

            createdAt:
                firebase.firestore.FieldValue
                .serverTimestamp()

        };


        db.collection("investments")
            .add(investmentData)
            .then(function () {

                alert(
                    "Investment request recorded.\n\n" +
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

                loadActiveInvestment();

            })
            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to record the investment request."
                );

            });

    };


    /* =========================================
       DASHBOARD
    ========================================= */

    async function updateDashboard() {

        if (!currentUser || !db) {
            return;
        }


        try {

            const userDoc =
                await db
                    .collection("users")
                    .doc(currentUser.uid)
                    .get();


            if (!userDoc.exists) {
                return;
            }


            const data =
                userDoc.data();


            const balance =
                Number(data.balance || 0);


            const investedCapital =
                Number(
                    data.investedCapital || 0
                );


            const totalReturns =
                Number(
                    data.totalReturns || 0
                );


            const formatMoney =
                function (value) {

                    return "$" +
                        Number(value || 0)
                            .toLocaleString(
                                undefined,
                                {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }
                            );

                };


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
                    formatMoney(balance);

            }


            if (investedAmount) {

                investedAmount.textContent =
                    formatMoney(
                        investedCapital
                    );

            }


            if (profitAmount) {

                profitAmount.textContent =
                    formatMoney(
                        totalReturns
                    );

            }


            loadActiveInvestment();

        } catch (error) {

            console.error(
                "Dashboard error:",
                error
            );

        }

    }


    /* =========================================
       ACTIVE INVESTMENT
    ========================================= */

    async function loadActiveInvestment() {

        if (!currentUser || !db) {
            return;
        }


        const card =
            document.getElementById(
                "activeInvestmentCard"
            );


        if (!card) {
            return;
        }


        try {

            const snapshot =
                await db
                    .collection("investments")
                    .where(
                        "userId",
                        "==",
                        currentUser.uid
                    )
                    .where(
                        "status",
                        "==",
                        "active"
                    )
                    .limit(1)
                    .get();


            if (snapshot.empty) {

                card.style.display = "none";

                return;
            }


            const doc =
                snapshot.docs[0];


            const investment =
                doc.data();


            card.style.display =
                "block";


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
                    Number(
                        investment.capital || 0
                    ).toLocaleString(
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
                    Number(
                        investment.returnAmount || 0
                    ).toLocaleString(
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


            localStorage.setItem(
                "chimeInvestment",
                JSON.stringify({
                    ...investment,
                    id: doc.id
                })
            );


            updateInvestmentTimer();

        } catch (error) {

            console.error(
                "Investment loading error:",
                error
            );

        }

    }


    /* =========================================
       INVESTMENT TIMER
    ========================================= */

    function updateInvestmentTimer() {

        const timer =
            document.getElementById(
                "investmentTimer"
            );


        if (!timer) {
            return;
        }


        let investment = null;


        try {

            investment =
                JSON.parse(
                    localStorage.getItem(
                        "chimeInvestment"
                    )
                );

        } catch (error) {

            investment = null;

        }


        if (!investment) {

            timer.textContent =
                "00d 00h 00m 00s";

            return;

        }


        const remaining =
            Number(
                investment.endTime
            ) -
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
    ========================================= */

    window.makeDeposit = function () {

        if (!currentUser) {

            alert(
                "Please create an account first."
            );

            showPage("signup");

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


        const depositData = {

            userId:
                currentUser.uid,

            amount:
                amount,

            currency:
                currency
                    ? currency.value
                    : "USDT",

            network:
                network
                    ? network.value
                    : "TRC20",

            status:
                "pending",

            createdAt:
                firebase.firestore.FieldValue
                .serverTimestamp()

        };


        db.collection("deposits")
            .add(depositData)
            .then(function () {

                alert(
                    "Deposit request submitted.\n\n" +
                    "Amount: $" +
                    amount.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    ) +
                    "\nCrypto: " +
                    depositData.currency +
                    "\nNetwork: " +
                    depositData.network +
                    "\n\nStatus: Pending"
                );


                amountInput.value = "";

                loadTransactions();

            })
            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to submit deposit request."
                );

            });

    };


    /* =========================================
       DEPOSIT NOTICE
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

        if (!currentUser) {

            alert(
                "Please create an account first."
            );

            showPage("signup");

            return;
        }


        const input =
            document.getElementById(
                "withdrawAmount"
            );


        const destination =
            document.getElementById(
                "bankAccount"
            );


        const method =
            document.getElementById(
                "withdrawMethod"
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


        const withdrawalData = {

            userId:
                currentUser.uid,

            amount:
                amount,

            destination:
                destination.value.trim(),

            method:
                method
                    ? method.value
                    : "crypto",

            status:
                "pending",

            createdAt:
                firebase.firestore.FieldValue
                .serverTimestamp()

        };


        db.collection("withdrawals")
            .add(withdrawalData)
            .then(function () {

                alert(
                    "Withdrawal request submitted.\n\n" +
                    "Amount: $" +
                    amount.toLocaleString(
                        undefined,
                        {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }
                    ) +
                    "\n\nStatus: Pending"
                );


                input.value = "";

                destination.value = "";

                loadTransactions();

            })
            .catch(function (error) {

                console.error(error);

                alert(
                    "Unable to submit withdrawal request."
                );

            });

    };


    /* =========================================
       TRANSACTIONS
    ========================================= */

    async function loadTransactions() {

        const list =
            document.getElementById(
                "transactionList"
            );


        if (!list || !currentUser || !db) {
            return;
        }


        try {

            const transactions = [];


            const deposits =
                await db
                    .collection("deposits")
                    .where(
                        "userId",
                        "==",
                        currentUser.uid
                    )
                    .get();


            deposits.forEach(function (doc) {

                const data =
                    doc.data();


                transactions.push({

                    id: doc.id,

                    type: "Deposit",

                    amount:
                        Number(data.amount || 0),

                    status:
                        data.status || "pending",

                    date:
                        data.createdAt
                            ? data.createdAt.toDate()
                            : new Date()

                });

            });


            const withdrawals =
                await db
                    .collection("withdrawals")
                    .where(
                        "userId",
                        "==",
                        currentUser.uid
                    )
                    .get();


            withdrawals.forEach(function (doc) {

                const data =
                    doc.data();


                transactions.push({

                    id: doc.id,

                    type: "Withdrawal",

                    amount:
                        Number(data.amount || 0),

                    status:
                        data.status || "pending",

                    date:
                        data.createdAt
                            ? data.createdAt.toDate()
                            : new Date()

                });

            });


            const investments =
                await db
                    .collection("investments")
                    .where(
                        "userId",
                        "==",
                        currentUser.uid
                    )
                    .get();


            investments.forEach(function (doc) {

                const data =
                    doc.data();


                transactions.push({

                    id: doc.id,

                    type: "Investment",

                    amount:
                        Number(data.capital || 0),

                    status:
                        data.status || "pending",

                    date:
                        data.createdAt
                            ? data.createdAt.toDate()
                            : new Date()

                });

            });


            transactions.sort(
                function (a, b) {

                    return b.date - a.date;

                }
            );


            if (!transactions.length) {

                list.innerHTML = `
                    <div class="empty-state">
                        <span>📋</span>
                        <h3>No transactions yet</h3>
                        <p>Your transactions will appear here.</p>
                    </div>
                `;

                return;
            }


            list.innerHTML = "";


            transactions.forEach(
                function (transaction) {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "transaction-item";


                    item.innerHTML = `
                        <div>
                            <strong>
                                ${transaction.type}
                            </strong>
                            <small>
                                ${transaction.date.toLocaleString()}
                            </small>
                        </div>

                        <div>
                            <strong>
                                $${transaction.amount.toLocaleString(
                                    undefined,
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    }
                                )}
                            </strong>

                            <small>
                                ${transaction.status}
                            </small>
                        </div>
                    `;


                    list.appendChild(item);

                }
            );


        } catch (error) {

            console.error(
                "Transaction loading error:",
                error
            );

        }

    }


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

    async function updateAccountDetails() {

        if (!currentUser || !db) {
            return;
        }


        try {

            const userDoc =
                await db
                    .collection("users")
                    .doc(currentUser.uid)
                    .get();


            if (!userDoc.exists) {
                return;
            }


            const data =
                userDoc.data();


            const emailElement =
                document.getElementById(
                    "accountEmail"
                );


            if (emailElement) {

                emailElement.textContent =
                    data.email ||
                    currentUser.email ||
                    "Not added";

            }


            const telegramElement =
                document.getElementById(
                    "accountTelegram"
                );


            if (telegramElement) {

                telegramElement.textContent =
                    data.telegramUsername ||
                    "Telegram User";

            }


            const createdElement =
                document.getElementById(
                    "accountCreated"
                );


            if (createdElement) {

                if (data.createdAt) {

                    createdElement.textContent =
                        data.createdAt
                            .toDate()
                            .toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                }
                            );

                } else {

                    createdElement.textContent =
                        "Recently";

                }

            }


            const profileName =
                document.getElementById(
                    "profileName"
                );


            if (profileName) {

                profileName.textContent =
                    data.name ||
                    "Chime User";

            }


        } catch (error) {

            console.error(
                "Account details error:",
                error
            );

        }

    }


    /* =========================================
       CREATE ACCOUNT
    ========================================= */

    window.createChimeAccount = async function () {

        const nameElement =
            document.getElementById(
                "signupName"
            );


        const emailElement =
            document.getElementById(
                "signupEmail"
            );


        const passwordElement =
            document.getElementById(
                "signupPassword"
            );


        const confirmElement =
            document.getElementById(
                "signupConfirmPassword"
            );


        const termsElement =
            document.getElementById(
                "signupTerms"
            );


        const telegramElement =
            document.getElementById(
                "signupTelegram"
            );


        const message =
            document.getElementById(
                "signupMessage"
            );


        if (
            !nameElement ||
            !emailElement ||
            !passwordElement ||
            !confirmElement ||
            !termsElement
        ) {

            return;
        }


        const name =
            nameElement.value.trim();


        const email =
            emailElement.value.trim();


        const password =
            passwordElement.value;


        const confirmPassword =
            confirmElement.value;


        const terms =
            termsElement.checked;


        const telegramUsername =
            telegramElement
                ? telegramElement.value.trim()
                : "Telegram User";


        function showMessage(text) {

            if (message) {
                message.textContent = text;
            }

        }


        if (!name) {

            showMessage(
                "Please enter your full name."
            );

            return;
        }


        if (
            !email ||
            !email.includes("@")
        ) {

            showMessage(
                "Please enter a valid email address."
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (
            password !==
            confirmPassword
        ) {

            showMessage(
                "Passwords do not match."
            );

            return;
        }


        if (!terms) {

            showMessage(
                "Please accept the applicable terms."
            );

            return;
        }


        if (!auth || !db) {

            showMessage(
                "Firebase is not connected. Please refresh the app."
            );

            return;
        }


        showMessage(
            "Creating your account..."
        );


        try {

            const credential =
                await auth
                    .createUserWithEmailAndPassword(
                        email,
                        password
                    );


            currentUser =
                credential.user;


            await createUserProfile(
                currentUser,
                name,
                telegramUsername
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
                "chimeEmail",
                email
            );


            if (telegramUsername) {

                localStorage.setItem(
                    "chimeTelegram",
                    telegramUsername
                );

            }


            showMessage(
                "Account created successfully."
            );


            nameElement.value = "";
            emailElement.value = "";
            passwordElement.value = "";
            confirmElement.value = "";
            termsElement.checked = false;


            setTimeout(function () {

                showPage("dashboard");

                updateDashboard();

            }, 700);


        } catch (error) {

            console.error(
                "Account creation error:",
                error
            );


            let errorMessage =
                "Unable to create account.";


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                errorMessage =
                    "This email is already registered.";

            }


            if (
                error.code ===
                "auth/invalid-email"
            ) {

                errorMessage =
                    "Please enter a valid email address.";

            }


            if (
                error.code ===
                "auth/weak-password"
            ) {

                errorMessage =
                    "Password is too weak.";

            }


            showMessage(
                errorMessage
            );

        }

    };

/* =========================================
   FIREBASE LOGIN
========================================= */

window.loginChime = async function () {

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");
    const message = document.getElementById("loginMessage");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    if (!window.chimeAuth) {
        alert("Firebase Authentication is not connected.");
        return;
    }

    try {

        if (message) {
            message.textContent = "Logging in...";
        }

        await window.chimeAuth.signInWithEmailAndPassword(
            email,
            password
        );

        if (message) {
            message.textContent = "";
        }

        emailInput.value = "";
        passwordInput.value = "";

        window.showPage("dashboard");

    } catch (error) {

        console.error("Login error:", error);

        if (message) {
            message.textContent = "";
        }

        if (
            error.code === "auth/invalid-credential" ||
            error.code === "auth/wrong-password" ||
            error.code === "auth/user-not-found"
        ) {
            alert("Incorrect email or password.");
        } else {
            alert("Login failed: " + error.message);
        }
    }
};
    /* =========================================
       LOGOUT
    ========================================= */

    window.logoutChime = async function () {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (!confirmLogout) {
            return;
        }


        try {

            if (auth) {
                await auth.signOut();
            }

            currentUser = null;

            localStorage.removeItem(
                "chimeHasEnteredApp"
            );

            showPage("welcome");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    };


    /* =========================================
       DUPLICATE PAGE CLEANUP
    ========================================= */

    function cleanDuplicatePages() {

        const pages =
            document.querySelectorAll(".page");


        let activeFound = false;


        pages.forEach(function (page) {

            if (
                page.classList.contains(
                    "active"
                )
            ) {

                if (!activeFound) {

                    activeFound = true;

                    page.style.display =
                        "block";

                } else {

                    page.classList.remove(
                        "active"
                    );

                    page.style.display =
                        "none";

                }

            } else {

                page.style.display =
                    "none";

            }

        });

    }


    /* =========================================
       STARTING PAGE
    ========================================= */

    function initializeStartingPage() {

        const pages =
            document.querySelectorAll(
                ".page"
            );


        pages.forEach(function (page) {

            page.classList.remove(
                "active"
            );

            page.style.display =
                "none";

        });


        if (currentUser) {

            showPage("dashboard");

        } else {

            showPage("welcome");

        }

    }


    /* =========================================
       FIREBASE AUTH STATE
    ========================================= */

    function listenForAuthentication() {

        if (!auth) {
            return;
        }


        auth.onAuthStateChanged(
            async function (user) {

                currentUser =
                    user || null;


                if (user) {

                    localStorage.setItem(
                        "chimeHasEnteredApp",
                        "true"
                    );


                    try {

                        const userDoc =
                            await db
                                .collection("users")
                                .doc(user.uid)
                                .get();


                        if (userDoc.exists) {

                            const data =
                                userDoc.data();


                            localStorage.setItem(
                                "chimeName",
                                data.name ||
                                "Chime User"
                            );


                            localStorage.setItem(
                                "chimeEmail",
                                data.email ||
                                user.email ||
                                ""
                            );

                        }

                    } catch (error) {

                        console.error(
                            "User profile loading error:",
                            error
                        );

                    }


                    showPage("dashboard");

                    updateDashboard();

                    updateAccountDetails();


                } else {

                    localStorage.removeItem(
                        "chimeHasEnteredApp"
                    );

                    showPage("welcome");

                }

            }
        );

    }


    /* =========================================
       APP INITIALIZATION
    ========================================= */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeFirebaseConnection();


            cleanDuplicatePages();


            loadTelegramUser();


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


            listenForAuthentication();


            updateWeekendDepositNotice();


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

})();
