// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, child, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBKHchgZEmwnyhHiuRznTGu4LV6kMk1f0Q",
//   authDomain: "groupchat-b228d.firebaseapp.com",
//   projectId: "groupchat-b228d",
//   storageBucket: "groupchat-b228d.appspot.com",
//   messagingSenderId: "329230089438",
//   appId: "1:329230089438:web:9954d0746586b3c0b9564f",
//   measurementId: "G-21YS77WNXG"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCJKVppwiMYt3jJVNEMNH0C0b54Irbw-g8",
  authDomain: "fitscape-c4c6b.firebaseapp.com",
  projectId: "fitscape-c4c6b",
  storageBucket: "fitscape-c4c6b.firebasestorage.app",
  messagingSenderId: "1080622560065",
  appId: "1:1080622560065:web:61350fa22bdb791646a7c0",
  measurementId: "G-76YF8SL7WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Elements
const viewGroupsButton = document.getElementById('viewGroupsButton');
const groupList = document.getElementById('groupList');
const loadingSpinner = document.getElementById('loadingSpinner');

// Function to fetch and display groups
function fetchGroups() {
  groupList.innerHTML = ''; // Clear previous groups
  loadingSpinner.style.display = 'block'; // Show spinner

  const dbRef = ref(db);
  get(child(dbRef, 'fitnessGroups')).then((snapshot) => {
    loadingSpinner.style.display = 'none'; // Hide spinner

    if (snapshot.exists()) {
      const groups = snapshot.val();

      // Loop through each group and create a card
      for (const groupId in groups) {
        const group = groups[groupId];

        // Create group card
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';

        // Group details
        const groupName = document.createElement('h2');
        groupName.textContent = group.groupName.toUpperCase();

        const eventName = document.createElement('p');
        eventName.innerHTML = `<strong>Event:</strong> ${group.eventName}`;

        const date = document.createElement('p');
        date.innerHTML = `<strong>Date:</strong> ${group.date}`;

        const timings = document.createElement('p');
        timings.innerHTML = `<strong>Timings:</strong> ${group.timings}`;

        const location = document.createElement('p');
        location.innerHTML = `<strong>Location:</strong> ${group.location}`;

        const charges = document.createElement('p');
        charges.innerHTML = `<strong>Charges:</strong> ${group.charges}`;

        const ageGroup = document.createElement('p');
        ageGroup.innerHTML = `<strong>Age Group:</strong> ${group.ageGroup}`;

        const description = document.createElement('p');
        description.innerHTML = `<strong>Description:</strong> ${group.description}`;

        // Join button
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join Group';
        joinButton.addEventListener('click', () => {
          // Save group ID to local storage/session storage
          sessionStorage.setItem('joinedGroupId', groupId);
          
          // Increment joined participants count
          const updatedJoinedParticipants = (group.joinedParticipants || 0) + 1;
          const groupRef = ref(db, `fitnessGroups/${groupId}`);
          update(groupRef, { joinedParticipants: updatedJoinedParticipants });

          // Redirect to group details page
          window.location.href = 'event-details.html';
        });

        // Append elements to group card
        groupCard.appendChild(groupName);
        groupCard.appendChild(eventName);
        groupCard.appendChild(date);
        groupCard.appendChild(timings);
        groupCard.appendChild(location);
        groupCard.appendChild(charges);
        groupCard.appendChild(ageGroup);
        groupCard.appendChild(description);
        groupCard.appendChild(joinButton);

        // Append group card to the group list
        groupList.appendChild(groupCard);
      }
    } else {
      groupList.innerHTML = '<p>No groups available at the moment.</p>';
    }
  }).catch((error) => {
    loadingSpinner.style.display = 'none'; // Hide spinner
    console.error('Error fetching groups: ', error);
  });
}

// Fetch groups when "View Groups" button is clicked
viewGroupsButton.addEventListener('click', fetchGroups);