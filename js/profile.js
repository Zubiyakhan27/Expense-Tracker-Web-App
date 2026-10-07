async function loadProfile() {

    try {

        const response = await fetch(
            "php/get_profile.php",
            {
                credentials: "include"
            }
        );

        if (response.status === 401) {

            window.location.href = "login.html";

            return;
        }

        const result = await response.json();

        if (!result.success) {

            alert(result.message);

            return;
        }

        document.getElementById("profileName").value =
            result.user.name || "";

        document.getElementById("profileEmail").value =
            result.user.email || "";

    } catch (error) {

        console.error(error);

        alert("Unable to load profile.");

    }
}


document.getElementById("logoutButton")
    .addEventListener(
        "click",
        async function () {

            try {

                await fetch(
                    "php/logout.php",
                    {
                        method: "POST",
                        credentials: "include"
                    }
                );

            } catch (error) {

                console.error(error);

            }

            localStorage.removeItem(
                "expenseTrackerUser"
            );

            window.location.href = "login.html";

        }
    );


loadProfile();