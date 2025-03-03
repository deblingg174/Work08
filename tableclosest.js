let sortNameAscending = true;
        let sortEmailAscending = true;

        function saveToLocalStorage() {
            const rows = Array.from(document.querySelectorAll("#dataTable tbody tr"));
            const data = rows.map(row => ({
                name: row.cells[0].textContent,
                email: row.cells[1].textContent
            }));
            localStorage.setItem("studentData", JSON.stringify(data));
        }

        function loadFromLocalStorage() {
            const data = JSON.parse(localStorage.getItem("studentData")) || [];
            const tableBody = document.querySelector("#dataTable tbody");
            tableBody.innerHTML = "";
            data.forEach(item => addRow(item.name, item.email));
        }

        function addRow(name, email) {
            const tableBody = document.querySelector("#dataTable tbody");
            const newRow = document.createElement("tr");

            newRow.innerHTML = `
                <td>${name}</td>
                <td>${email}</td>
                <td>
                    <button class="btn btn-warning btn-sm editBtn">Edit</button>
                    <button class="btn btn-danger btn-sm removeBtn">Remove</button>
                </td>
            `;
            tableBody.appendChild(newRow);
            saveToLocalStorage();
        }

        document.getElementById("addRowBtn").addEventListener("click", () => {
            let studentName = document.getElementById("studentName").value.trim();
            let email = document.getElementById("email").value.trim();
            
            if (!studentName || !email) {
                alert("Please enter both name and email.");
                return;
            }

            addRow(studentName, email);
            document.getElementById("studentName").value = "";
            document.getElementById("email").value = "";
        });

        document.getElementById("dataTable").addEventListener("click", (event) => {
            const target = event.target;
            const row = target.closest("tr");
            
            if (target.classList.contains("editBtn")) {
                const cells = row.querySelectorAll("td");
                const nameValue = cells[0].textContent;
                const emailValue = cells[1].textContent;

                cells[0].innerHTML = `<input type="text" value="${nameValue}" class="form-control">`;
                cells[1].innerHTML = `<input type="email" value="${emailValue}" class="form-control">`;

                target.textContent = "Update";
                target.classList.remove("editBtn");
                target.classList.add("updateBtn");
            }

            else if (target.classList.contains("updateBtn")) {
                const nameInput = row.cells[0].querySelector("input").value.trim();
                const emailInput = row.cells[1].querySelector("input").value.trim();

                if (!nameInput || !emailInput) {
                    alert("Name and email cannot be empty.");
                    return;
                }

                row.cells[0].textContent = nameInput;
                row.cells[1].textContent = emailInput;

                target.textContent = "Edit";
                target.classList.remove("updateBtn");
                target.classList.add("editBtn");

                saveToLocalStorage();
            }

            else if (target.classList.contains("removeBtn")) {
                row.remove();
                saveToLocalStorage();
            }
        });

        function sortTable(columnIndex, ascending) {
            const tableBody = document.querySelector("#dataTable tbody");
            let rows = Array.from(tableBody.querySelectorAll("tr"));
            
            rows.sort((a, b) => {
                let valA = a.cells[columnIndex].textContent.toLowerCase();
                let valB = b.cells[columnIndex].textContent.toLowerCase();
                return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
            });

            tableBody.innerHTML = "";
            rows.forEach(row => tableBody.appendChild(row));
            saveToLocalStorage();
        }

        document.getElementById("sortNameBtn").addEventListener("click", () => {
            sortTable(0, sortNameAscending);
            sortNameAscending = !sortNameAscending;
            document.getElementById("sortNameBtn").textContent = sortNameAscending ? "Sort by Name (A-Z)" : "Sort by Name (Z-A)";
        });

        document.getElementById("sortEmailBtn").addEventListener("click", () => {
            sortTable(1, sortEmailAscending);
            sortEmailAscending = !sortEmailAscending;
            document.getElementById("sortEmailBtn").textContent = sortEmailAscending ? "Sort by Email (A-Z)" : "Sort by Email (Z-A)";
        });

        window.addEventListener("load", loadFromLocalStorage);