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


$data = json_decode(
    file_get_contents("php://input"),
    true
);


$user_id =
    (int)$_SESSION["user_id"];


$amount =
    isset($data["amount"])
        ? (float)$data["amount"]
        : 0;


$month =
    trim(
        $data["month"] ?? ""
    );


if ($amount <= 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Budget must be greater than zero."

    ]);

    exit;
}


if (
    !preg_match(
        "/^\d{4}-(0[1-9]|1[0-2])$/",
        $month
    )
) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid month format."

    ]);

    exit;
}


$stmt =
    $conn->prepare(
        "INSERT INTO budgets
        (
            user_id,
            amount,
            month
        )
        VALUES (?, ?, ?)

        ON DUPLICATE KEY UPDATE
            amount = VALUES(amount)"
    );


$stmt->bind_param(
    "ids",
    $user_id,
    $amount,
    $month
);


if ($stmt->execute()) {

    echo json_encode([

        "success" => true,

        "message" =>
            "Budget saved successfully."

    ]);

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to save budget."

    ]);

}


$stmt->close();

$conn->close();

?>