let balance = 5000;
let earnings = 250;

let investments = [];


// ================================
// TELEGRAM MINI APP
// ================================

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();

    const user = tg.initDataUnsafe?.user;

    if (user) {
        console.log("Telegram user:", user);
    }
}


// ================================
// DEPOSIT
// ================================

function openDeposit() {

    document.getElementById("depositModal").style.display = "flex";
}


// ================================
// WITHDRAW
// ================================

function openWithdraw() {

    document.getElementById("withdrawModal").style.display = "flex";
}


// ================================
// CLOSE MODALS
// ================================

function closeModals() {

    document.getElementById("depositModal").style.display = "none";

    document.getElementById("withdrawModal").style.display = "none";
}


// ================================
// DEPOSIT ACTION
// ================================

function deposit() {

    const input =
        document.getElementById("depositAmount");

    const amount = Number(input.value);

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }

    alert(
        "Deposit request received for ₦" +
        amount.toLocaleString("en-NG") +
        "."
    );

    input.value = "";

    closeModals();
}


// ================================
// WITHDRAW ACTION
// ================================

function withdraw() {

    const input =
        document.getElementById("withdrawAmount");

    const amount = Number(input.value);

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }

    if (amount > balance) {

        alert("Insufficient available balance.");

        return;
    }

    balance -= amount;

    updateBalance();

    addTransaction(
        "Withdrawal Request",
        "-₦" + amount.toLocaleString("en-NG"),
        false
    );

    input.value = "";

    closeModals();

    alert("Withdrawal request submitted.");
}


// ================================
// INVESTMENT
// ================================

function invest(planName, amount) {

    if (balance < amount) {

        alert(
            "You need at least ₦" +
            amount.toLocaleString("en-NG") +
            " to invest in this plan."
        );

        return;
    }

    const confirmInvestment = confirm(

        planName +
        "\n\nInvestment amount: ₦" +
        amount.toLocaleString("en-NG") +
        "\n\nDo you want to continue?"
    );

    if (!confirmInvestment) {

        return;
    }

    balance -= amount;

    investments.push({

        plan: planName,

        amount: amount,

        date: new Date().toLocaleDateString()

    });

    updateBalance();

    addTransaction(

        planName,

        "-₦" + amount.toLocaleString("en-NG"),

        false
    );

    alert(

        "Your " +
        planName +
        " investment has been created."
    );
}


// ================================
// UPDATE BALANCE
// ================================

function updateBalance() {

    document.getElementById("balance").textContent =

        "₦" +
        balance.toLocaleString("en-NG", {

            minimumFractionDigits: 2,

            maximumFractionDigits: 2

        });
}


// ================================
// ADD TRANSACTION
// ================================

function addTransaction(title, amount, positive) {

    const list =
        document.getElementById("transactionList");

    const transaction =
        document.createElement("div");

    transaction.className = "transaction";

    transaction.innerHTML = `

        <div>

            <strong>${title}</strong>

            <p>Just now</p>

        </div>

        <span class="${positive ? "positive" : "status"}">

            ${amount}

        </span>

    `;

    list.prepend(transaction);
}


// ================================
// MY INVESTMENTS
// ================================

function showInvestments() {

    if (investments.length === 0) {

        alert(
            "You don't have any active investments yet."
        );

        return;
    }

    let message =
        "My Investments\n\n";

    investments.forEach((investment, index) => {

        message +=

            (index + 1) +
            ". " +
            investment.plan +
            "\nAmount: ₦" +
            investment.amount.toLocaleString("en-NG") +
            "\nStarted: " +
            investment.date +
            "\n\n";
    });

    alert(message);
}


// ================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ================================

window.addEventListener("click", function(event) {

    const depositModal =
        document.getElementById("depositModal");

    const withdrawModal =
        document.getElementById("withdrawModal");

    if (event.target === depositModal) {

        closeModals();
    }

    if (event.target === withdrawModal) {

        closeModals();
    }

});


// ================================
// INITIAL BALANCE
// ================================

updateBalance();
