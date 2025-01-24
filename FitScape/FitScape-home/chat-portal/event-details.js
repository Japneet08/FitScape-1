// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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

// Fetch group ID from session storage
const groupId = sessionStorage.getItem('joinedGroupId');

// Fetch group details and participants info
function loadEventDetails() {
  const groupRef = ref(db, 'fitnessGroups/' + groupId);

  get(groupRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      document.getElementById('eventName').innerText = data.eventName;
      document.getElementById('eventDate').innerText = "Date: " + data.date;
      document.getElementById('eventTime').innerText = "Timings: " + data.timings;
      document.getElementById('eventLocation').innerText = "Location: " + data.location;
      document.getElementById('eventCharges').innerText = "Charges: " + data.charges;
      document.getElementById('eventDescription').innerText = "Description: "+data.description;
      document.getElementById('joinedParticipants').innerText = "Joined Participants: " + (data.joinedParticipants || 0);
      document.getElementById('confirmedParticipants').innerText = "Confirmed Participants: " + (data.confirmedParticipants || 0);
      
      // Call countdown timer function
      updateCountdownTimer(data.date);
    }
  });
}

// Update confirmed participants count
document.getElementById('confirmButton').addEventListener('click', () => {
  const groupRef = ref(db, 'fitnessGroups/' + groupId);
  const isChecked = document.getElementById('confirmCheckbox').checked;

  if (isChecked) {
    get(groupRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const updatedConfirmed = (data.confirmedParticipants || 0) + 1;
        update(groupRef, { confirmedParticipants: updatedConfirmed });
        document.getElementById('confirmedParticipants').innerText = "Confirmed Participants: " + updatedConfirmed;
        alert('Your presence has been confirmed!');
      }
    });
  } else {
    alert('Please check the confirmation box before submitting.');
  }
});

// Handle chat button click
document.getElementById('chatButton').addEventListener('click', () => {
  // Redirect to the chat portal or chat interface
  window.location.href = 'chat.html';  // Replace with the actual chat page
});

// Handle close button click
document.getElementById('closeButton').addEventListener('click', () => {
  // Close the current window or redirect to the previous page
  window.location.href = 'interface.html';  // Replace with the group list page or home page
});

// Function to calculate days left until the event and display countdown
function updateCountdownTimer(eventDate) {
  const eventDateObj = new Date(eventDate); // Convert event date to a Date object
  const today = new Date();
  const timeDiff = eventDateObj.getTime() - today.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Calculate days left

  if (daysLeft > 0) {
    document.getElementById('countdownTimer').innerText = `Event starting in: ${daysLeft} days`;
  } else if (daysLeft === 0) {
    document.getElementById('countdownTimer').innerText = 'The event is today!';
  } else {
    document.getElementById('countdownTimer').innerText = 'The event has passed.';
  }
}

// Call the function to load event details
loadEventDetails();