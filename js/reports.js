let expenseChart = null;

let incomeExpenseChart = null;

let monthlyExpenseChart = null;

async function loadReports() {

    try {

        const response =
            await fetch(
                "php/get_reports.php",
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

            alert(result.message);

            return;
        }

        const categories =
            result.categoryData.map(
                function (item) {

                    return item.category;

                }
            );


        const categoryTotals =
            result.categoryData.map(
                function (item) {

                    return Number(
                        item.total
                    );

                }
            );


        const expenseCanvas =
            document.getElementById(
                "expenseChart"
            );


        expenseChart =
            new Chart(
                expenseCanvas,
                {

                    type: "doughnut",

                    data: {

                        labels:
                            categories,

                        datasets: [{

                            label:
                                "Expenses",

                            data:
                                categoryTotals

                        }]

                    },

                    options: {

                        responsive: true,

                        plugins: {

                            legend: {

                                position:
                                    "bottom"

                            }

                        }

                    }

                }
            );

        const incomeExpenseCanvas =
            document.getElementById(
                "incomeExpenseChart"
            );


        incomeExpenseChart =
            new Chart(
                incomeExpenseCanvas,
                {

                    type: "bar",

                    data: {

                        labels: [
                            "Income",
                            "Expense"
                        ],

                        datasets: [{

                            label:
                                "Amount",

                            data: [

                                Number(
                                    result.totalIncome
                                ),

                                Number(
                                    result.totalExpense
                                )

                            ]

                        }]

                    },

                    options: {

                        responsive: true,

                        scales: {

                            y: {

                                beginAtZero:
                                    true

                            }

                        }

                    }

                }
            );

        const months =
            result.monthlyExpenses.map(
                function (item) {

                    return item.month;

                }
            );


        const monthlyTotals =
            result.monthlyExpenses.map(
                function (item) {

                    return Number(
                        item.total
                    );

                }
            );


        const monthlyCanvas =
            document.getElementById(
                "monthlyExpenseChart"
            );


        monthlyExpenseChart =
            new Chart(
                monthlyCanvas,
                {

                    type: "line",

                    data: {

                        labels:
                            months,

                        datasets: [{

                            label:
                                "Monthly Expenses",

                            data:
                                monthlyTotals,

                            tension:
                                0.3

                        }]

                    },

                    options: {

                        responsive: true,

                        scales: {

                            y: {

                                beginAtZero:
                                    true

                            }

                        }

                    }

                }
            );

    } catch (error) {

        console.error(error);

        alert(
            "Unable to load reports."
        );

    }
}


loadReports();