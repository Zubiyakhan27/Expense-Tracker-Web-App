const incomeForm =
    document.getElementById("incomeForm");

const incomeTable =
    document.getElementById("incomeTable");


const incomeDate =
    document.getElementById("incomeDate");


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


incomeDate.value =
    getLocalDate();

incomeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const source =
            document.getElementById(
                "incomeSource"
            ).value;


        const amount =
            parseFloat(
                document.getElementById(
                    "incomeAmount"
                ).value
            );


        const date =
            document.getElementById(
                "incomeDate"
            ).value;


        const description =
            document.getElementById(
                "incomeDescription"
            ).value.trim();


        if (!source) {

            alert(
                "Please select an income source."
            );

            return;
        }


        if (
            isNaN(amount) ||
            amount <= 0
        ) {

            alert(
                "Please enter a valid amount."
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
                    "php/add_income.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            source:
                                source,

                            amount:
                                amount,

                            date:
                                date,

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

                incomeForm.reset();

                incomeDate.value =
                    getLocalDate();

                loadIncome();

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    }
);

async function loadIncome() {

    try {

        const response =
            await fetch(
                "php/get_income.php",
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

            incomeTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        ${result.message}
                    </td>
                </tr>
            `;

            return;
        }


        incomeTable.innerHTML = "";


        if (
            !result.data ||
            result.data.length === 0
        ) {

            incomeTable.innerHTML = `
                <tr>
                    <td colspan="5">
                        No income records found.
                    </td>
                </tr>
            `;

            return;
        }


        result.data.forEach(
            function (income) {

                const row =
                    document.createElement("tr");


                const sourceCell =
                    document.createElement("td");

                sourceCell.textContent =
                    income.source;


                const amountCell =
                    document.createElement("td");

                amountCell.textContent =
                    "₹" +
                    Number(income.amount)
                        .toFixed(2);


                const dateCell =
                    document.createElement("td");

                dateCell.textContent =
                    income.date;


                const descriptionCell =
                    document.createElement("td");

                descriptionCell.textContent =
                    income.description || "-";


                const actionCell =
                    document.createElement("td");


                const editButton =
                    document.createElement("button");

                editButton.textContent =
                    "Edit";


                editButton.addEventListener(
                    "click",
                    function () {

                        editIncome(income);

                    }
                );


                const deleteButton =
                    document.createElement("button");

                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    function () {

                        deleteIncome(
                            income.income_id
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
                    sourceCell
                );

                row.appendChild(
                    amountCell
                );

                row.appendChild(
                    dateCell
                );

                row.appendChild(
                    descriptionCell
                );

                row.appendChild(
                    actionCell
                );


                incomeTable.appendChild(row);

            }
        );

    } catch (error) {

        console.error(error);

        incomeTable.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load income records.
                </td>
            </tr>
        `;

    }
}

async function editIncome(income) {

    const source =
        prompt(
            "Enter income source:",
            income.source
        );


    if (source === null) return;


    const amount =
        prompt(
            "Enter amount:",
            income.amount
        );


    if (amount === null) return;


    const date =
        prompt(
            "Enter date (YYYY-MM-DD):",
            income.date
        );


    if (date === null) return;


    const description =
        prompt(
            "Enter description:",
            income.description || ""
        );


    if (description === null) return;


    const numericAmount =
        parseFloat(amount);


    if (!source.trim()) {

        alert(
            "Income source cannot be empty."
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
                "php/update_income.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        income_id:
                            income.income_id,

                        source:
                            source.trim(),

                        amount:
                            numericAmount,

                        date:
                            date,

                        description:
                            description.trim()

                    })
                }
            );


        const result =
            await response.json();


        alert(result.message);


        if (result.success) {

            loadIncome();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to update income."
        );

    }
}

async function deleteIncome(incomeId) {

    if (
        !confirm(
            "Are you sure you want to delete this income?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                "php/delete_income.php",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({

                        income_id:
                            incomeId

                    })
                }
            );


        const result =
            await response.json();


        alert(result.message);


        if (result.success) {

            loadIncome();

        }

    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete income."
        );

    }
}


loadIncome();