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


$stmt =
    $conn->prepare(
        "SELECT
            expense_id,
            category,
            amount,
            date,
            payment_method,
            description
         FROM expenses
         WHERE user_id = ?
         ORDER BY date DESC, expense_id DESC"
    );


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result =
    $stmt->get_result();


$expenses = [];


while (
    $row = $result->fetch_assoc()
) {

    $row["amount"] =
        (float)$row["amount"];


    $expenses[] =
        $row;
}


echo json_encode([

    "success" => true,

    "data" =>
        $expenses

]);


$stmt->close();

$conn->close();

?>