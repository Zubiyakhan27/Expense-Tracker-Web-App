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


$expense_id =
    isset($data["expense_id"])
        ? (int)$data["expense_id"]
        : 0;


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


if ($expense_id <= 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid expense ID."

    ]);

    exit;
}


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
        "UPDATE expenses
         SET
            category = ?,
            amount = ?,
            date = ?,
            payment_method = ?,
            description = ?
         WHERE expense_id = ?
           AND user_id = ?"
    );


$stmt->bind_param(
    "sdsssii",
    $category,
    $amount,
    $date,
    $paymentMethod,
    $description,
    $expense_id,
    $user_id
);


if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([

            "success" => true,

            "message" =>
                "Expense updated successfully."

        ]);

    } else {

        echo json_encode([

            "success" => false,

            "message" =>
                "Expense record not found or no changes made."

        ]);

    }

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to update expense."

    ]);

}


$stmt->close();

$conn->close();

?>