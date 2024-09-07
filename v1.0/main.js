import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase keys
const supabaseUrl = 'https://haamtrstuuxcrbcvgmtv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhYW10cnN0dXV4Y3JiY3ZnbXR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQyNTAyMzYsImV4cCI6MjAzOTgyNjIzNn0.TrqEPqF7WDuZxmpYTBy9jBzHmxJREF6idtoLDQpkcSs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addMission(missionPoster, missionName, missionDescription) {
    const { data, error } = await supabase
        .from('missions')
        .insert([
            { poster: missionPoster, name: missionName, description: missionDescription }
        ]);

    if (error) {
        console.error('Error adding mission:', error);
    } else {
        // Clear the form inputs 
        document.getElementById('mission-poster').value = '';
        document.getElementById('mission-name').value = '';
        document.getElementById('mission-description').value = '';

        // Reload missions
        missionArea.innerHTML = ''; 
        loadMissions(); 
    }
}

// Get references to HTML elements (make sure these IDs match your HTML)
const missionForm = document.getElementById('mission-form');
const missionPosterInput = document.getElementById('mission-poster');
const missionArea = document.getElementById('mission-area');
const adminPasswordInput = document.getElementById('admin-password');

// Replace with your actual admin password
const ADMIN_PASSWORD = 'Abc123!@#$%'; 

// Check if admin is already logged in (from sessionStorage)
let isAdminLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
if (isAdminLoggedIn) {
    showDeleteButtons(); 
}

// Load missions from Supabase on page load
async function loadMissions() { 
    // 1. Fetch initial missions
    const { data, error } = await supabase
        .from('missions')
        .select('*');

    if (error) {
        console.error('Error loading initial missions:', error);
    } else {
        data.forEach((mission) => {
            displayMission(mission.poster, mission.name, mission.description, mission.id);
        });
    }

    // 2. Subscribe to real-time changes (add this part)
    const subscription = supabase
        .from('missions')
        .on('*', (payload) => {
            console.log('Change received!', payload);
            // Update the mission list based on the payload
            missionArea.innerHTML = ''; // Clear existing missions
            loadMissions(); // Re-fetch and display missions
        })
        .subscribe(); 

    // ... (optional: handle unsubscribing when the component unmounts) ...
}



// Event listener for form submission
missionForm.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const missionPoster = missionPosterInput.value;
    const missionName = document.getElementById('mission-name').value;
    const missionDescription = document.getElementById('mission-description').value;

    addMission(missionPoster, missionName, missionDescription); 
});

function displayMission(missionPoster, missionName, missionDescription, missionId) { 
    const newMissionItem = document.createElement('div');
    newMissionItem.innerHTML = `
        <h3>${missionName}</h3>
        <p>Posted by: ${missionPoster}</p>
        <p>${missionDescription}</p>
        <button class="delete-button" data-mission-id="${missionId}" hidden>Delete</button>
    `;
    missionArea.appendChild(newMissionItem);

    // Event listener for delete button
    const deleteButton = newMissionItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
        deleteMission(missionId);
    });
}
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
} // <-- Add this closing curly brace