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


$income_id =
    isset($data["income_id"])
        ? (int)$data["income_id"]
        : 0;


$source =
    trim($data["source"] ?? "");


$amount =
    isset($data["amount"])
        ? (float)$data["amount"]
        : 0;


$date =
    trim($data["date"] ?? "");


$description =
    trim(
        $data["description"] ?? ""
    );


if ($income_id <= 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Invalid income ID."

    ]);

    exit;
}


if ($source === "") {

    echo json_encode([

        "success" => false,

        "message" =>
            "Income source is required."

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
        "UPDATE income
         SET
            source = ?,
            amount = ?,
            date = ?,
            description = ?
         WHERE income_id = ?
           AND user_id = ?"
    );


$stmt->bind_param(
    "sdssii",
    $source,
    $amount,
    $date,
    $description,
    $income_id,
    $user_id
);


if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {

        echo json_encode([

            "success" => true,

            "message" =>
                "Income updated successfully."

        ]);

    } else {

        echo json_encode([

            "success" => false,

            "message" =>
                "Income record not found or no changes made."

        ]);

    }

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to update income."

    ]);

}


$stmt->close();

$conn->close();

?>