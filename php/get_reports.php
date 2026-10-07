<?php

require_once "db.php";


if (!isset($_SESSION["user_id"])) {

    http_response_code(401);

    echo json_encode([

        "success" => false,

        "message" =>
            "Please login first."

    ]);

    exit;
}


$user_id =
    (int)$_SESSION["user_id"];


// ==========================================
// EXPENSE BY CATEGORY
// ==========================================

$stmt =
    $conn->prepare(
        "SELECT
            category,
            SUM(amount) AS total
         FROM expenses
         WHERE user_id = ?
         GROUP BY category
         ORDER BY total DESC"
    );


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result =
    $stmt->get_result();


$categoryData = [];


while (
    $row =
        $result->fetch_assoc()
) {

    $categoryData[] = [

        "category" =>
            $row["category"],

        "total" =>
            (float)$row["total"]

    ];

}


$stmt->close();


// ==========================================
// TOTAL INCOME
// ==========================================

$stmt =
    $conn->prepare(
        "SELECT
            COALESCE(
                SUM(amount),
                0
            ) AS total
         FROM income
         WHERE user_id = ?"
    );


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result =
    $stmt->get_result();


$row =
    $result->fetch_assoc();


$totalIncome =
    (float)$row["total"];


$stmt->close();


// ==========================================
// TOTAL EXPENSE
// ==========================================

$stmt =
    $conn->prepare(
        "SELECT
            COALESCE(
                SUM(amount),
                0
            ) AS total
         FROM expenses
         WHERE user_id = ?"
    );


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result =
    $stmt->get_result();


$row =
    $result->fetch_assoc();


$totalExpense =
    (float)$row["total"];


$stmt->close();


// ==========================================
// MONTHLY EXPENSES
// ==========================================

$stmt =
    $conn->prepare(
        "SELECT
            DATE_FORMAT(
                date,
                '%Y-%m'
            ) AS month,

            SUM(amount) AS total

         FROM expenses

         WHERE user_id = ?

         GROUP BY
            DATE_FORMAT(
                date,
                '%Y-%m'
            )

         ORDER BY month ASC"
    );


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result =
    $stmt->get_result();


$monthlyExpenses = [];


while (
    $row =
        $result->fetch_assoc()
) {

    $monthlyExpenses[] = [

        "month" =>
            $row["month"],

        "total" =>
            (float)$row["total"]

    ];

}


$stmt->close();


// ==========================================
// FINAL RESPONSE
// ==========================================

echo json_encode([

    "success" => true,

    "categoryData" =>
        $categoryData,

    "totalIncome" =>
        $totalIncome,

    "totalExpense" =>
        $totalExpense,

    "monthlyExpenses" =>
        $monthlyExpenses

]);


$conn->close();

?>