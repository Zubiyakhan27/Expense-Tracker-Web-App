const expenseForm =
    document.getElementById("expenseForm");

const expenseTable =
    document.getElementById("expenseTable");


const expenseDate =
    document.getElementById("expenseDate");


function getLocalDate() {

    const date = new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


expenseDate.value =
    getLocalDate();


expenseForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const amount =
            parseFloat(
                document.getElementById(
                    "expenseAmount"
                ).value
            );


        const category =
            document.getElementById(
                "expenseCategory"
            ).value;


        const date =
            document.getElementById(
                "expenseDate"
            ).value;


        const paymentMethod =
            document.getElementById(
                "paymentMethod"
            ).value;


        const description =
            document.getElementById(
                "expenseDescription"
            ).value.trim();


        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
            );

            return;
        }


        if (!category) {

            alert(
                "Please select a category."
            );

            return;
        }


        if (!date) {

            alert(
                "Please select a date."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    "php/add_expense.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            category:
                                category,

                            amount:
                                amount,

                            date:
                                date,

                            paymentMethod:
                                paymentMethod,

                            description:
                                description

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

                expenseForm.reset();

                expenseDate.value =
                    getLocalDate();

                loadExpenses();

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to add expense."
            );

        }

    }
);


async function loadExpenses() {

    try {

        const response =
            await fetch(
                "php/get_expenses.php",
                {
                    credentials: "include"
                }
            );


        if (response.status === 401) {

            window.location.href =
                "login.html";

            return;
        }


        const result =
            await response.json();


        if (!result.success) {

            expenseTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        ${result.message}
                    </td>
                </tr>
            `;

            return;
        }


        expenseTable.innerHTML = "";


        if (
            !result.data ||
            result.data.length === 0
        ) {

            expenseTable.innerHTML = `
                <tr>
                    <td colspan="6">
                        No expenses found.
                    </td>
                </tr>
            `;

            return;
        }


        result.data.forEach(
            function (expense) {

                const row =
                    document.createElement("tr");


                const categoryCell =
                    document.createElement("td");

                categoryCell.textContent =
                    expense.category;


                const amountCell =
                    document.createElement("td");

                amountCell.textContent =
                    "₹" +
                    Number(expense.amount)
                        .toFixed(2);


                const dateCell =
                    document.createElement("td");

                dateCell.textContent =
                    expense.date;


                const paymentCell =
                    document.createElement("td");

                paymentCell.textContent =
                    expense.payment_method ||
                    "-";


                const descriptionCell =
                    document.createElement("td");

                descriptionCell.textContent =
                    expense.description ||
                    "-";


                const actionCell =
                    document.createElement("td");


                const editButton =
                    document.createElement("button");

                editButton.textContent =
                    "Edit";


                editButton.addEventListener(
                    "click",
                    function () {

                        editExpense(expense);

                    }
                );


                const deleteButton =
                    document.createElement("button");

                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteExpense(
                            expense.expense_id
                        );

                    }
                );


                actionCell.appendChild(
                    editButton
                );

                actionCell.appendChild(
                    document.createTextNode(" ")
                );

                actionCell.appendChild(
                    deleteButton
                );


                row.appendChild(
                    categoryCell
                );

                row.appendChild(
                    amountCell
                );

                row.appendChild(
                    dateCell
                );

                row.appendChild(
                    paymentCell
                );

                row.appendChild(
                    descriptionCell
                );

                row.appendChild(
                    actionCell
                );


                expenseTable.appendChild(row);

            }
        );

    } catch (error) {

        console.error(error);

        expenseTable.innerHTML = `
            <tr>
                <td colspan="6">
                    Unable to load expenses.
                </td>
            </tr>
        `;

    }
}


async function editExpense(expense) {

    const category =
        prompt(
            "Enter category:",
            expense.category
        );


    if (category === null) return;


    const amount =
        prompt(
            "Enter amount:",
            expense.amount
        );


    if (amount === null) return;


    const date =
        prompt(
            "Enter date (YYYY-MM-DD):",
            expense.date
        );


    if (date === null) return;


    const paymentMethod =
        prompt(
            "Enter payment method:",
            expense.payment_method || "Cash"
        );


    if (paymentMethod === null) return;


    const description =
        prompt(
            "Enter description:",
            expense.description || ""
        );


    if (description === null) return;


    const numericAmount =
        parseFloat(amount);


    if (!category.trim()) {

        alert(
            "Category cannot be empty."
        );

        return;
    }


    if (
        isNaN(numericAmount) ||
        numericAmount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "php/update_expense.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        expense_id:
                            expense.expense_id,

                        category:
                            category.trim(),

                        amount:
                            numericAmount,

                        date:
                            date,

                        paymentMethod:
                            paymentMethod.trim(),

                        description:
                            description.trim()

                    })
                }
            );


        const result =
            await response.json();


        alert(result.message);


        if (result.success) {

            loadExpenses();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to update expense."
        );

    }
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

            loadExpenses();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete expense."
        );

    }
}


loadExpenses();