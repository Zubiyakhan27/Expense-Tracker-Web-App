async function loadDashboard() {

    try {

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


        const incomeResponse =
            await fetch(
                "php/get_income.php",
                {
                    credentials: "include"
                }
            );


        if (incomeResponse.status === 401) {

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

            alert("Unable to load dashboard.");

            return;
        }


        let totalExpenses = 0;

        let totalIncome = 0;


        expenseResult.data.forEach(
            function (expense) {

                totalExpenses +=
                    Number(expense.amount);

            }
        );


        incomeResult.data.forEach(
            function (income) {

                totalIncome +=
                    Number(income.amount);

            }
        );


        const balance =
            totalIncome - totalExpenses;


        document.getElementById(
            "totalIncome"
        ).textContent =
            "₹" +
            totalIncome.toFixed(2);


        document.getElementById(
            "totalExpenses"
        ).textContent =
            "₹" +
            totalExpenses.toFixed(2);


        document.getElementById(
            "balance"
        ).textContent =
            "₹" +
            balance.toFixed(2);


        // Combine transactions
        const transactions = [];


        expenseResult.data.forEach(
            function (expense) {

                transactions.push({

                    type: "Expense",

                    description:
                        expense.description ||
                        expense.category,

                    amount:
                        Number(expense.amount),

                    date:
                        expense.date

                });

            }
        );


        incomeResult.data.forEach(
            function (income) {

                transactions.push({

                    type: "Income",

                    description:
                        income.description ||
                        income.source,

                    amount:
                        Number(income.amount),

                    date:
                        income.date

                });

            }
        );


        transactions.sort(
            function (a, b) {

                return new Date(b.date) -
                    new Date(a.date);

            }
        );


        const recent =
            transactions.slice(0, 5);


        const table =
            document.getElementById(
                "recentTransactions"
            );


        table.innerHTML = "";


        if (recent.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">
                        No transactions found.
                    </td>
                </tr>
            `;

            return;
        }


        recent.forEach(
            function (transaction) {

                const row =
                    document.createElement("tr");


                const typeCell =
                    document.createElement("td");

                typeCell.textContent =
                    transaction.type;


                const descriptionCell =
                    document.createElement("td");

                descriptionCell.textContent =
                    transaction.description;


                const amountCell =
                    document.createElement("td");

                amountCell.textContent =
                    "₹" +
                    transaction.amount.toFixed(2);


                const dateCell =
                    document.createElement("td");

                dateCell.textContent =
                    transaction.date;


                row.appendChild(typeCell);

                row.appendChild(
                    descriptionCell
                );

                row.appendChild(amountCell);

                row.appendChild(dateCell);


                table.appendChild(row);

            }
        );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load dashboard."
        );

    }
}


loadDashboard();