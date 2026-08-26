let balance = 0;

let investments = [];


// Telegram Mini App
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;

    if (user) {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();

        document.getElementById("username").textContent =
            fullName || "Telegram User";
    }
}


// PAGE NAVIGATION

function showPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active");
    });

    const selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// UPDATE BALANCE

function updateBalance() {

    document.getElementById("balance").textContent =
        "₦" + balance.toLocaleString("en-NG", {
            minimumFractionDigits: 2
        });

    document.getElementById("profileBalance").textContent =
        "₦" + balance.toLocaleString("en-NG", {
            minimumFractionDigits: 2
        });

    document.getElementById("investmentCount").textContent =
        investments.length;
}


// DEPOSIT

function deposit() {

    const amount =
        Number(document.getElementById("depositAmount").value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    alert(
        "Deposit request received for ₦" +
        amount.toLocaleString("en-NG") +
        ". Payment integration will be added later."
    );

    document.getElementById("depositAmount").value = "";
}


// WITHDRAW

function withdraw() {

    const amount =
        Number(document.getElementById("withdrawAmount").value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (amount > balance) {
        alert("Insufficient balance.");
        return;
    }

    alert(
        "Withdrawal request received for ₦" +
        amount.toLocaleString("en-NG") +
        "."
    );

    document.getElementById("withdrawAmount").value = "";
}


// SELECT INVESTMENT PLAN

function selectPlan(name, amount, profit, duration) {

    const confirmation = confirm(
        `Investment Plan: ${name}\n\n` +
        `Amount: ₦${amount.toLocaleString("en-NG")}\n` +
        `Profit: ${profit}%\n` +
        `Duration: ${duration} days\n\n` +
        `Do you want to continue?`
    );

    if (!confirmation) {
        return;
    }

    if (balance < amount) {

        alert(
            "You need at least ₦" +
            amount.toLocaleString("en-NG") +
            " in your balance to invest."
        );

        showPage("deposit");

        return;
    }

    balance -= amount;

    const investment = {
        name: name,
        amount: amount,
        profit: profit,
        duration: duration,
        date: new Date().toLocaleDateString()
    };

    investments.push(investment);

    updateBalance();

    displayInvestments();

    alert("Investment created successfully!");

    showPage("investments");
}


// DISPLAY INVESTMENTS

function displayInvestments() {

    const list =
        document.getElementById("investmentList");

    if (investments.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                📊
                <h3>No Investments Yet</h3>
                <p>Your active investments will appear here.</p>
            </div>
        `;

        return;
    }

    list.innerHTML = "";

    investments.forEach(investment => {

        const card = document.createElement("div");

        card.className = "plan";

        card.innerHTML = `
            <h4>${investment.name}</h4>

            <p class="amount">
                ₦${investment.amount.toLocaleString("en-NG")}
            </p>

            <p>Profit: <strong>${investment.profit}%</strong></p>

            <p>Duration: ${investment.duration} days</p>

            <p>Started: ${investment.date}</p>
        `;

        list.appendChild(card);
    });
}


// START APP

updateBalance();
displayInvestments();
