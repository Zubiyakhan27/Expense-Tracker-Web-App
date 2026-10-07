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


$category =
    trim($data["category"] ?? "");


$amount =
    isset($data["amount"])
        ? (float)$data["amount"]
        : 0;


$date =
    trim($data["date"] ?? "");


$paymentMethod =
    trim(
        $data["paymentMethod"] ?? ""
    );


$description =
    trim(
        $data["description"] ?? ""
    );


if ($category === "") {

    echo json_encode([

        "success" => false,

        "message" =>
            "Category is required."

    ]);

    exit;
}


if ($amount <= 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Amount must be greater than zero."

    ]);

    exit;
}


$dateObject =
    DateTime::createFromFormat(
        "Y-m-d",
        $date
    );


if (
    !$dateObject ||
    $dateObject->format("Y-m-d") !== $date
) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid date."

    ]);

    exit;
}


$stmt =
    $conn->prepare(
        "INSERT INTO expenses
        (
            user_id,
            category,
            amount,
            date,
            payment_method,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?)"
    );


$stmt->bind_param(
    "isdsss",
    $user_id,
    $category,
    $amount,
    $date,
    $paymentMethod,
    $description
);


if ($stmt->execute()) {

    echo json_encode([

        "success" => true,

        "message" =>
            "Expense added successfully."

    ]);

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to add expense."

    ]);

}


$stmt->close();

$conn->close();

?>