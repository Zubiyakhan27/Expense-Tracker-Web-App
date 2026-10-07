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
            income_id,
            source,
            amount,
            date,
            description
         FROM income
         WHERE user_id = ?
         ORDER BY date DESC, income_id DESC"
    );


$stmt->bind_param(
    "i",
    $user_id
);


$stmt->execute();


$result =
    $stmt->get_result();


$income = [];


while (
    $row = $result->fetch_assoc()
) {

    $row["amount"] =
        (float)$row["amount"];


    $income[] =
        $row;
}


echo json_encode([

    "success" => true,

    "data" =>
        $income

]);


$stmt->close();

$conn->close();

?>