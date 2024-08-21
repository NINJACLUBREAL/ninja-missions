const missionForm = document.getElementById('mission-form');
const missionPoster = document.getElementById('mission-poster');
const missionArea = document.getElementById('mission-area');
const adminPasswordInput = document.getElementById('admin-password');

// Replace with your actual admin password
const ADMIN_PASSWORD = 'Abc123!@#$%'; 

// Check if admin is already logged in (from sessionStorage)
let isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
if (isAdminLoggedIn) {
    showDeleteButtons(); 
}

// Load missions from localStorage on page load
loadMissions();

missionForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const missionPoster = document.getElementById('mission-poster').value;
    const missionName = document.getElementById('mission-name').value;
    const missionDescription = document.getElementById('mission-description').value;

    addMission(missionPoster, missionName, missionDescription); 
});

function addMission(missionPoster, missionName, missionDescription) {
    let missions = getMissions(); 
    missions.push({ poster: missionPoster, name: missionName, description: missionDescription }); 
    localStorage.setItem('missions', JSON.stringify(missions));

    // Clear the form inputs 
    document.getElementById('mission-poster').value = '';
    document.getElementById('mission-name').value = '';
    document.getElementById('mission-description').value = '';

    // Reload missions to display in the correct order
    missionArea.innerHTML = ''; 
    loadMissions(); 
}

function getMissions() {
    let missions = localStorage.getItem('missions');
    return missions ? JSON.parse(missions) : []; 
}

function loadMissions() {
    let missions = getMissions();
    missions.reverse(); // Newest missions first
    missions.forEach((mission, index) => {
        displayMission(mission.poster, mission.name, mission.description, index);
    });
}

function displayMission(missionPoster, missionName, missionDescription, index) {
    const newMissionItem = document.createElement('div'); 
    newMissionItem.innerHTML = `
        <h3>${missionName}</h3>
        <p>Posted by: ${missionPoster}</p>
        <p>${missionDescription}</p>
        <button class="delete-button" data-index="${index}" hidden>Delete</button>
    `;
    missionArea.prepend(newMissionItem); 
}

// Corrected checkAdmin function (typo fixed and no duplicate)
function checkAdmin() {
    const enteredPassword = adminPasswordInput.value;
    if (enteredPassword === ADMIN_PASSWORD) {
        alert("Admin authenticated!");
        sessionStorage.setItem('isAdminLoggedIn', 'true'); // Store login status
        isAdminLoggedIn = true;
        showDeleteButtons();
    } else {
        alert("Incorrect password.");
    }
}

function showDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => button.hidden = false);
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const indexToDelete = button.dataset.index;
            deleteMission(indexToDelete);
        });
    });
}

function deleteMission(index) {
    let missions = getMissions();
    missions.splice(index, 1); // Remove the mission at the specified index
    localStorage.setItem('missions', JSON.stringify(missions));
    // Remove only the deleted mission element from the display:
    const missionToDelete = document.querySelector(`.delete-button[data-index="${index}"]`).parentElement;
    missionArea.removeChild(missionToDelete); 
}