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


$month =
    trim(
        $_GET["month"] ?? date("Y-m")
    );


if (
    !preg_match(
        "/^\d{4}-(0[1-9]|1[0-2])$/",
        $month
    )
) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid month."

    ]);

    exit;
}


$stmt =
    $conn->prepare(
        "SELECT
            budget_id,
            amount,
            month
         FROM budgets
         WHERE user_id = ?
           AND month = ?"
    );


$stmt->bind_param(
    "is",
    $user_id,
    $month
);


$stmt->execute();


$result =
    $stmt->get_result();


if (
    $row =
        $result->fetch_assoc()
) {

    $row["amount"] =
        (float)$row["amount"];


    echo json_encode([

        "success" => true,

        "data" =>
            $row

    ]);

} else {

    echo json_encode([

        "success" => true,

        "data" => null

    ]);

}


$stmt->close();

$conn->close();

?>