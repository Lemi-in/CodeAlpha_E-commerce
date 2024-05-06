document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById("contact-form");
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Send form data to server using AJAX or fetch
        // Example using fetch API
        fetch(form.action, {
            method: "POST",
            body: new FormData(form)
        })
        .then(response => {
            if (response.ok) {
                // If email is sent successfully, redirect to success.html
                window.location.href = "emailConform.html";
            } else {
                // Handle errors or display error message to user
                console.error("Error sending email");
            }
        })
        .catch(error => {
            console.error("Error sending email:", error);
        });
    });
});
