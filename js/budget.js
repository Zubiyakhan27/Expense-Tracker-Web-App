const budgetForm =
    document.getElementById("budgetForm");


const budgetAmountInput =
    document.getElementById("budgetAmount");


const currentBudget =
    document.getElementById("currentBudget");


const budgetSpent =
    document.getElementById("budgetSpent");


const budgetRemaining =
    document.getElementById("budgetRemaining");


const budgetStatus =
    document.getElementById("budgetStatus");


const currentMonthElement =
    document.getElementById("currentMonth");


function getCurrentMonth() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    return `${year}-${month}`;
}


const currentMonth =
    getCurrentMonth();


currentMonthElement.textContent =
    currentMonth;


budgetForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const amount =
            parseFloat(
                budgetAmountInput.value
            );


        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid budget."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    "php/add_budget.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            amount:
                                amount,

                            month:
                                currentMonth

                        })
                    }
                );


            if (response.status === 401) {

                window.location.href =
                    "login.html";

                return;
            }


            const result =
                await response.json();


            alert(result.message);


            if (result.success) {

                budgetAmountInput.value = "";

                loadBudget();

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to save budget."
            );

        }

    }
);


async function loadBudget() {

    try {

        const budgetResponse =
            await fetch(
                `php/get_budget.php?month=${encodeURIComponent(currentMonth)}`,
                {
                    credentials: "include"
                }
            );


        if (budgetResponse.status === 401) {

            window.location.href =
                "login.html";

            return;
        }


        const budgetResult =
            await budgetResponse.json();


        let budget = 0;


        if (
            budgetResult.success &&
            budgetResult.data
        ) {

            budget =
                Number(
                    budgetResult.data.amount
                );

        }


        currentBudget.textContent =
            budget.toFixed(2);


        const expenseResponse =
            await fetch(
                "php/get_expenses.php",
                {
                    credentials: "include"
                }
            );


        if (expenseResponse.status === 401) {

            window.location.href =
                "login.html";

            return;
        }


        const expenseResult =
            await expenseResponse.json();


        let spent = 0;


        if (
            expenseResult.success &&
            Array.isArray(expenseResult.data)
        ) {

            expenseResult.data.forEach(
                function (expense) {

                    if (
                        expense.date &&
                        expense.date.substring(0, 7)
                            === currentMonth
                    ) {

                        spent +=
                            Number(
                                expense.amount
                            );

                    }

                }
            );

        }


        budgetSpent.textContent =
            spent.toFixed(2);


        const remaining =
            budget - spent;


        budgetRemaining.textContent =
            remaining.toFixed(2);


        if (budget <= 0) {

            budgetStatus.textContent =
                "No budget has been set for this month.";

        } else if (remaining < 0) {

            budgetStatus.textContent =
                "Your expenses have exceeded the budget.";

        } else {

            budgetStatus.textContent =
                "You are currently within your budget.";

        }

    } catch (error) {

        console.error(error);

        budgetStatus.textContent =
            "Unable to load budget information.";

    }
}


loadBudget();