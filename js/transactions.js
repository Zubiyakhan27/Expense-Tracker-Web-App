let allTransactions = [];


const searchInput =
    document.getElementById(
        "searchTransaction"
    );


const filterSelect =
    document.getElementById(
        "transactionFilter"
    );


const transactionTable =
    document.getElementById(
        "transactionTable"
    );

async function loadTransactions() {

    try {

        const [
            expenseResponse,
            incomeResponse
        ] = await Promise.all([

            fetch(
                "php/get_expenses.php",
                {
                    credentials: "include"
                }
            ),

            fetch(
                "php/get_income.php",
                {
                    credentials: "include"
                }
            )

        ]);


        if (
            expenseResponse.status === 401 ||
            incomeResponse.status === 401
        ) {

            window.location.href =
                "login.html";

            return;
        }


        const expenseResult =
            await expenseResponse.json();


        const incomeResult =
            await incomeResponse.json();


        if (
            !expenseResult.success ||
            !incomeResult.success
        ) {

            alert(
                "Unable to load transactions."
            );

            return;
        }


        allTransactions = [];


        expenseResult.data.forEach(
            function (expense) {

                allTransactions.push({

                    id:
                        expense.expense_id,

                    type:
                        "expense",

                    typeLabel:
                        "Expense",

                    category:
                        expense.category,

                    amount:
                        Number(expense.amount),

                    date:
                        expense.date,

                    description:
                        expense.description || "",

                    paymentMethod:
                        expense.payment_method || ""

                });

            }
        );


        incomeResult.data.forEach(
            function (income) {

                allTransactions.push({

                    id:
                        income.income_id,

                    type:
                        "income",

                    typeLabel:
                        "Income",

                    category:
                        income.source,

                    amount:
                        Number(income.amount),

                    date:
                        income.date,

                    description:
                        income.description || ""

                });

            }
        );


        allTransactions.sort(
            function (a, b) {

                return new Date(b.date) -
                    new Date(a.date);

            }
        );


        displayTransactions();

    } catch (error) {

        console.error(error);

        transactionTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load transactions.
                </td>
            </tr>
        `;

    }
}

function displayTransactions() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filter =
        filterSelect.value;


    const filtered =
        allTransactions.filter(
            function (transaction) {

                const matchesSearch =

                    transaction.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    transaction.description
                        .toLowerCase()
                        .includes(search);


                const matchesFilter =

                    filter === "all"

                    ||

                    transaction.type === filter;


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    transactionTable.innerHTML = "";


    if (filtered.length === 0) {

        transactionTable.innerHTML = `
            <tr>
                <td colspan="6">
                    No transactions found.
                </td>
            </tr>
        `;

        return;
    }


    filtered.forEach(
        function (transaction) {

            const row =
                document.createElement("tr");


            const typeCell =
                document.createElement("td");

            typeCell.textContent =
                transaction.typeLabel;


            const categoryCell =
                document.createElement("td");

            categoryCell.textContent =
                transaction.category;


            const amountCell =
                document.createElement("td");

            amountCell.textContent =
                "₹" +
                transaction.amount.toFixed(2);


            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                transaction.date;


            const descriptionCell =
                document.createElement("td");

            descriptionCell.textContent =
                transaction.description || "-";


            const actionCell =
                document.createElement("td");


            if (transaction.type === "expense") {

                const deleteButton =
                    document.createElement("button");

                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteExpense(
                            transaction.id
                        );

                    }
                );


                actionCell.appendChild(
                    deleteButton
                );

            } else {

                actionCell.textContent =
                    "Use Income page";

            }


            row.appendChild(typeCell);

            row.appendChild(categoryCell);

            row.appendChild(amountCell);

            row.appendChild(dateCell);

            row.appendChild(descriptionCell);

            row.appendChild(actionCell);


            transactionTable.appendChild(row);

        }
    );
}

async function deleteExpense(expenseId) {

    if (
        !confirm(
            "Are you sure you want to delete this expense?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                "php/delete_expense.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        expense_id:
                            expenseId

                    })
                }
            );


        const result =
            await response.json();


        alert(result.message);


        if (result.success) {

            loadTransactions();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete transaction."
        );

    }
}


searchInput.addEventListener(
    "input",
    displayTransactions
);


filterSelect.addEventListener(
    "change",
    displayTransactions
);


loadTransactions();