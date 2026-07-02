const API_URL = "http://localhost:8080/api";

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const dashboardSection = document.getElementById("dashboardSection");
const appHeader = document.getElementById("appHeader");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const noteForm = document.getElementById("noteForm");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerError = document.getElementById("registerError");

const showRegisterLink = document.getElementById("showRegisterLink");
const showLoginLink = document.getElementById("showLoginLink");

const logoutBtn = document.getElementById("logoutBtn");
const welcomeMessage = document.getElementById("welcomeMessage");

const noteId = document.getElementById("noteId");
const noteTitle = document.getElementById("noteTitle");
const noteContent = document.getElementById("noteContent");
const noteError = document.getElementById("noteError");
const noteSubmitBtn = document.getElementById("noteSubmitBtn");
const notesContainer = document.getElementById("notesContainer");

function getToken() {
    return localStorage.getItem("token");
}

function setToken(token) {
    localStorage.setItem("token", token);
}

function removeToken() {
    localStorage.removeItem("token");
}

function getUserName() {
    return localStorage.getItem("userName");
}

function setUserName(name) {
    localStorage.setItem("userName", name);
}

function removeUserName() {
    localStorage.removeItem("userName");
}

function showLogin() {
    loginSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
    dashboardSection.classList.add("hidden");
    appHeader.classList.add("hidden");
    loginError.textContent = "";
    registerError.textContent = "";
}

function showRegister() {
    loginSection.classList.add("hidden");
    registerSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
    appHeader.classList.add("hidden");
    loginError.textContent = "";
    registerError.textContent = "";
}

function showDashboard() {
    loginSection.classList.add("hidden");
    registerSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    appHeader.classList.remove("hidden");
    welcomeMessage.textContent = "Welcome, " + getUserName();
}

showRegisterLink.addEventListener("click", function (e) {
    e.preventDefault();
    showRegister();
});

showLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    showLogin();
});

loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    loginError.textContent = "";

    const payload = {
        email: loginEmail.value.trim(),
        password: loginPassword.value
    };

    try {
        const response = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            loginError.textContent = data.message || "Login failed. Please check your credentials.";
            return;
        }

        setToken(data.token);
        setUserName(data.name);
        loginForm.reset();
        showDashboard();
        await loadNotes();
    } catch (err) {
        loginError.textContent = "Unable to connect to server.";
    }
});

registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    registerError.textContent = "";

    const payload = {
        name: registerName.value.trim(),
        email: registerEmail.value.trim(),
        password: registerPassword.value
    };

    try {
        const response = await fetch(API_URL + "/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            registerError.textContent = data.message || "Registration failed. Please try again.";
            return;
        }

        setToken(data.token);
        setUserName(data.name);
        registerForm.reset();
        showDashboard();
        await loadNotes();
    } catch (err) {
        registerError.textContent = "Unable to connect to server.";
    }
});

logoutBtn.addEventListener("click", function () {
    removeToken();
    removeUserName();
    resetNoteForm();
    notesContainer.innerHTML = "";
    showLogin();
});

async function loadNotes() {
    noteError.textContent = "";
    const token = getToken();

    try {
        const response = await fetch(API_URL + "/notes", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            noteError.textContent = data.message || "Failed to load notes.";
            return;
        }

        renderNotes(data);
    } catch (err) {
        noteError.textContent = "Unable to connect to server.";
    }
}

function renderNotes(notes) {
    notesContainer.innerHTML = "";

    notes.forEach(function (note) {
        const card = document.createElement("div");
        card.classList.add("note-card");

        const title = document.createElement("h3");
        title.textContent = note.title;

        const content = document.createElement("p");
        content.textContent = note.content;

        const actions = document.createElement("div");
        actions.classList.add("note-card-actions");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("btn", "btn-edit");
        editBtn.addEventListener("click", function () {
            populateFormForEdit(note);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn", "btn-delete");
        deleteBtn.addEventListener("click", function () {
            deleteNote(note.id);
        });

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(title);
        card.appendChild(content);
        card.appendChild(actions);

        notesContainer.appendChild(card);
    });
}

function populateFormForEdit(note) {
    noteId.value = note.id;
    noteTitle.value = note.title;
    noteContent.value = note.content;
    noteSubmitBtn.textContent = "Update Note";
}

function resetNoteForm() {
    noteForm.reset();
    noteId.value = "";
    noteSubmitBtn.textContent = "Save Note";
}

noteForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    noteError.textContent = "";

    const id = noteId.value;
    const payload = {
        title: noteTitle.value.trim(),
        content: noteContent.value.trim()
    };

    if (id) {
        await updateNote(id, payload);
    } else {
        await createNote(payload);
    }
});

async function createNote(payload) {
    const token = getToken();

    try {
        const response = await fetch(API_URL + "/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            noteError.textContent = data.message || "Failed to create note.";
            return;
        }

        resetNoteForm();
        await loadNotes();
    } catch (err) {
        noteError.textContent = "Unable to connect to server.";
    }
}

async function updateNote(id, payload) {
    const token = getToken();

    try {
        const response = await fetch(API_URL + "/notes/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
        }

        const data = await response.json();

        if (!response.ok) {
            noteError.textContent = data.message || "Failed to update note.";
            return;
        }

        resetNoteForm();
        await loadNotes();
    } catch (err) {
        noteError.textContent = "Unable to connect to server.";
    }
}

async function deleteNote(id) {
    noteError.textContent = "";
    const token = getToken();

    try {
        const response = await fetch(API_URL + "/notes/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.status === 401 || response.status === 403) {
            handleUnauthorized();
            return;
        }

        if (!response.ok && response.status !== 204) {
            const data = await response.json();
            noteError.textContent = data.message || "Failed to delete note.";
            return;
        }

        await loadNotes();
    } catch (err) {
        noteError.textContent = "Unable to connect to server.";
    }
}

function handleUnauthorized() {
    removeToken();
    removeUserName();
    resetNoteForm();
    notesContainer.innerHTML = "";
    showLogin();
    loginError.textContent = "Session expired. Please login again.";
}

function autoLogin() {
    const token = getToken();
    if (token) {
        showDashboard();
        loadNotes();
    } else {
        showLogin();
    }
}

autoLogin();