<?php

require_once "db.php";

if (!isset($_SESSION["user_id"])) {

    http_response_code(401);

    echo json_encode([
        "success" => false,
        "message" => "Please login first."
    ]);

    exit;
}

$user_id = (int)$_SESSION["user_id"];

$stmt = $conn->prepare(
    "SELECT user_id, name, email, created_at
     FROM users
     WHERE user_id = ?"
);

$stmt->bind_param("i", $user_id);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows !== 1) {

    echo json_encode([
        "success" => false,
        "message" => "User not found."
    ]);

    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    "success" => true,
    "user" => $user
]);

$stmt->close();
$conn->close();

?>