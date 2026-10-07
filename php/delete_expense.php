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


$expense_id =
    isset($data["expense_id"])
        ? (int)$data["expense_id"]
        : 0;


$user_id =
    (int)$_SESSION["user_id"];


if ($expense_id <= 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid expense ID."

    ]);

    exit;
}


$stmt =
    $conn->prepare(
        "DELETE FROM expenses
         WHERE expense_id = ?
           AND user_id = ?"
    );


$stmt->bind_param(
    "ii",
    $expense_id,
    $user_id
);


if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([

            "success" => true,

            "message" =>
                "Expense deleted successfully."

        ]);

    } else {

        echo json_encode([

            "success" => false,

            "message" =>
                "Expense record not found."

        ]);

    }

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to delete expense."

    ]);

}


$stmt->close();

$conn->close();

?>