const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const email =
            document.getElementById(
                "loginEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "loginPassword"
            ).value;


        if (!email || !password) {

            alert(
                "Please enter email and password."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    "php/login.php",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "include",

                        body: JSON.stringify({

                            email: email,

                            password: password

                        })
                    }
                );


            const result =
                await response.json();


            if (result.success) {

                localStorage.setItem(
                    "expenseTrackerUser",
                    JSON.stringify(result.user)
                );


                window.location.href =
                    "dashboard.html";

            } else {

                alert(result.message);

            }

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    }
);