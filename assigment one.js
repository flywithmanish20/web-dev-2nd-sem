let events = JSON.parse(localStorage.getItem("events")) || [];
let editIndex = -1;

displayEvents();

// ADD / UPDATE EVENT
function addEvent() {
    let title = document.getElementById("title").value;
    let date = document.getElementById("date").value;
    let category = document.getElementById("category").value;
    let desc = document.getElementById("desc").value;

    if (title === "" || date === "") {
        alert("Fill required fields!");
        return;
    }

    let event = { title, date, category, desc };

    if (editIndex === -1) {
        events.push(event);
    } else {
        events[editIndex] = event;
        editIndex = -1;
    }

    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
    clearForm();
}

// DISPLAY EVENTS
function displayEvents(filtered = events) {
    let list = document.getElementById("eventList");

    if (filtered.length === 0) {
        list.innerHTML = "<p>No events found</p>";
        return;
    }

    list.innerHTML = "";

    filtered.forEach((e, index) => {
        list.innerHTML += `
            <div class="event">
                <h3>${e.title}</h3>
                <p><b>Date:</b> ${e.date}</p>
                <p><b>Category:</b> ${e.category}</p>
                <p>${e.desc}</p>
                <button onclick="editEvent(${index})">Edit</button>
                <button onclick="deleteEvent(${index})">Delete</button>
            </div>
        `;
    });
}

// DELETE
function deleteEvent(index) {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
}

// EDIT
function editEvent(index) {
    let e = events[index];

    document.getElementById("title").value = e.title;
    document.getElementById("date").value = e.date;
    document.getElementById("category").value = e.category;
    document.getElementById("desc").value = e.desc;

    editIndex = index;
}

// CLEAR ALL
function clearAll() {
    events = [];
    localStorage.removeItem("events");
    displayEvents();
}

// SEARCH
function searchEvent() {
    let query = document.getElementById("search").value.toLowerCase();

    let filtered = events.filter(e =>
        e.title.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
    );

    displayEvents(filtered);
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// CLEAR FORM
function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    document.getElementById("desc").value = "";
}