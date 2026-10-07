<?php

require_once "db.php";


$data = json_decode(
    file_get_contents("php://input"),
    true
);


$name =
    trim($data["name"] ?? "");


$email =
    trim($data["email"] ?? "");


$password =
    $data["password"] ?? "";


if (
    $name === "" ||
    $email === "" ||
    $password === ""
) {

    echo json_encode([

        "success" => false,

        "message" =>
            "All fields are required."

    ]);

    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Please enter a valid email."

    ]);

    exit;
}


if (strlen($password) < 6) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Password must contain at least 6 characters."

    ]);

    exit;
}


// Check existing email

$stmt =
    $conn->prepare(
        "SELECT user_id
         FROM users
         WHERE email = ?"
    );


$stmt->bind_param(
    "s",
    $email
);


$stmt->execute();


$result =
    $stmt->get_result();


if ($result->num_rows > 0) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Email is already registered."

    ]);

    exit;
}


$stmt->close();


// Hash password

$hashedPassword =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );


// Insert user

$stmt =
    $conn->prepare(
        "INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)"
    );


$stmt->bind_param(
    "sss",
    $name,
    $email,
    $hashedPassword
);


if ($stmt->execute()) {

    echo json_encode([

        "success" => true,

        "message" =>
            "Registration successful."

    ]);

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "Registration failed."

    ]);

}


$stmt->close();

$conn->close();

?>