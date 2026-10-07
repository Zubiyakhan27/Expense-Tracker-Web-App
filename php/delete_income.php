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


$income_id =
    isset($data["income_id"])
        ? (int)$data["income_id"]
        : 0;


$user_id =
    (int)$_SESSION["user_id"];


if ($income_id <= 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid income ID."

    ]);

    exit;
}


$stmt =
    $conn->prepare(
        "DELETE FROM income
         WHERE income_id = ?
           AND user_id = ?"
    );


$stmt->bind_param(
    "ii",
    $income_id,
    $user_id
);


if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([

            "success" => true,

            "message" =>
                "Income deleted successfully."

        ]);

    } else {

        echo json_encode([

            "success" => false,

            "message" =>
                "Income record not found."

        ]);

    }

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to delete income."

    ]);

}


$stmt->close();

$conn->close();

?>