document.addEventListener("DOMContentLoaded", ()=> {
    document.getElementById("frmlogin")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("lgEmail").value;
        const password = document.getElementById("lgPassword").value;

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                alert("Login Successful!");
                window.location.href = "dashboard.html"; 
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    });

    
    document.getElementById("frmsignup")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("Name").value;
        const email = document.getElementById("Email").value;
        const phone = document.getElementById("Phone").value;
        const password = document.getElementById("Password").value;

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Signup Successful!!");
                window.location.href = "login.html";
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    });
});