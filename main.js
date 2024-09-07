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
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    profile = googleUser.getBasicProfile();
  document.getElementById('userName').value = profile.getName();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3043782291.
  }
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
  
  function onSuccess(googleUser) {
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    const idToken = googleUser.getAuthResponse().id_token; 

    // Send the ID token to your backend (e.g., using fetch)
    fetch('/verify-token', {
        method
: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: idToken })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from your backend (e.g., set a cookie if successful)
        if (data.success) {
            // Optionally set a client-side cookie for quick UI updates
            document.cookie = "loggedIn=true; path=/"; 
        }
    })
    .catch(error => console.error('Error:', error));
}
const express = require('express');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Client ID
const client = new OAuth2Client(CLIENT_ID);

app.use(express.json()); // To parse JSON request bodies

app.post('/verify-token', async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID // Specify your client ID as the audience
        });
        const payload = ticket.getPayload();

        // If verification is successful, create a session and set a cookie
        res.cookie('session', 'some_session_value', { 
            httpOnly: true, 
            secure: true, // Use 'secure' in production environments
            maxAge: 3600000 // Cookie expiration time (in milliseconds)
        });
        res.json({ success: true });

    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

// ... rest of your backend code
