// Load tasks when the page loads
window.onload = function () {
    loadTasks();
};

document.getElementById("addTaskBtn").addEventListener("click", function () {
    const task = document.getElementById("taskName").value.trim();
    const plannedStart = document.getElementById("plannedStart").value;
    const plannedEnd = document.getElementById("plannedEnd").value;
    const actualStart = document.getElementById("actualStart").value;
    const actualEnd = document.getElementById("actualEnd").value;

    if (!task || !plannedStart || !plannedEnd || !actualStart || !actualEnd) {
        alert("Please fill in all fields.");
        return;
    }

    const deviation = calculateDeviation(plannedEnd, actualEnd);
    const status = deviation <= 0 ? "On Time" : "Delayed";

    const newTask = {
        id: Date.now(),
        task,
        plannedStart,
        plannedEnd,
        actualStart,
        actualEnd,
        deviation,
        status,
    };

    saveTask(newTask);
    displayTask(newTask);
    updateSummary();
    clearForm();
});

// Calculate deviation in minutes
function calculateDeviation(plannedEnd, actualEnd) {
    const [pH, pM] = plannedEnd.split(":").map(Number);
    const [aH, aM] = actualEnd.split(":").map(Number);

    const plannedMinutes = pH * 60 + pM;
    const actualMinutes = aH * 60 + aM;

    return actualMinutes - plannedMinutes;
}

// Save task to Local Storage
function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load and display tasks
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(displayTask);
    updateSummary();
}

// Display task in table
function displayTask(task) {
    const table = document.getElementById("taskTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${task.task}</td>
    <td>${task.plannedStart} - ${task.plannedEnd}</td>
    <td>${task.actualStart} - ${task.actualEnd}</td>
    <td>${task.deviation} min</td>
    <td style="color:${task.status === "On Time" ? "green" : "red"}">${task.status}</td>
  `;

    table.appendChild(row);
}

// Update summary section
function updateSummary() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const total = tasks.length;
    const onTime = tasks.filter((t) => t.status === "On Time").length;
    const delayed = total - onTime;

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("onTimeTasks").innerText = onTime;
    document.getElementById("delayedTasks").innerText = delayed;
}

// Clear form inputs
function clearForm() {
    document.getElementById("taskName").value = "";
    document.getElementById("plannedStart").value = "";
    document.getElementById("plannedEnd").value = "";
    document.getElementById("actualStart").value = "";
    document.getElementById("actualEnd").value = "";
}

document.getElementById("clearAllBtn").addEventListener("click", function () {
    if (confirm("Are you sure you want to clear all tasks?")) {
        localStorage.removeItem("tasks");
        document.getElementById("taskTableBody").innerHTML = "";
        updateSummary();
    }
});
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");

// Load theme from Local Storage
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.checked = true;
        themeLabel.textContent = "🌙 Dark Mode";
    }
});

// Toggle theme on switch
themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        themeLabel.textContent = "🌙 Dark Mode";
    } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        themeLabel.textContent = "🌞 Light Mode";
    }
});
window.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    document.getElementById("splash-screen").style.display = "none";
  }, 2500); // Splash screen duration in milliseconds
});

// charts
document.addEventListener("DOMContentLoaded", function () {
    // Dummy data – replace with actual logic later
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const plannedTasks = [5, 4, 6, 3, 5, 7, 4];
    const actualTasks = [4, 3, 5, 2, 5, 6, 4];

    // Bar Chart
    new Chart(document.getElementById('barChart'), {
        type: 'bar',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Planned Tasks',
                    data: plannedTasks,
                    backgroundColor: '#FFA94D'
                },
                {
                    label: 'Actual Tasks',
                    data: actualTasks,
                    backgroundColor: '#FF7A00'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Planned vs Actual Tasks' }
            }
        }
    });

    // Pie Chart
    const delayedCount = 5;
    const onTimeCount = 9;

    new Chart(document.getElementById('pieChart'), {
        type: 'pie',
        data: {
            labels: ['Delayed Tasks', 'On-Time Tasks'],
            datasets: [{
                label: 'Delay Status',
                data: [delayedCount, onTimeCount],
                backgroundColor: ['#FF6F61', '#81C784']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: { display: true, text: 'Delay Summary' }
            }
        }
    });
});
