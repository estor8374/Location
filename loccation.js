// location.js
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

const sendRequestBtn = document.getElementById('sendRequestBtn');
const targetEmail = document.getElementById('targetEmail');
const receivedRequest = document.getElementById('receivedRequest');
const requestFrom = document.getElementById('requestFrom');
const acceptBtn = document.getElementById('acceptBtn');
const locationDisplay = document.getElementById('locationDisplay');
const trackingEmail = document.getElementById('trackingEmail');
const lat = document.getElementById('lat');
const lng = document.getElementById('lng');
const timestamp = document.getElementById('timestamp');

sendRequestBtn.onclick = () => {
  const user = auth.currentUser;
  const email = user.email.replace('.', '_');
  const target = targetEmail.value.replace('.', '_');

  set(ref(db, `requests/${target}`), {
    from: email
  });

  alert('Request sent!');
};

onAuthStateChanged(auth, user => {
  if (!user) return;
  const email = user.email.replace('.', '_');

  const reqRef = ref(db, `requests/${email}`);
  onValue(reqRef, snapshot => {
    const data = snapshot.val();
    if (data && data.from) {
      receivedRequest.style.display = 'block';
      requestFrom.textContent = data.from;
    }
  });
});

acceptBtn.onclick = () => {
  const user = auth.currentUser;
  const email = user.email.replace('.', '_');

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      const data = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        time: new Date().toLocaleString()
      };
      set(ref(db, `locations/${email}`), data);
    });
  }

  receivedRequest.style.display = 'none';
};

const watchTargetLocation = () => {
  const target = targetEmail.value.replace('.', '_');
  const locRef = ref(db, `locations/${target}`);
  onValue(locRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      locationDisplay.style.display = 'block';
      trackingEmail.textContent = targetEmail.value;
      lat.textContent = data.lat;
      lng.textContent = data.lng;
      timestamp.textContent = data.time;
    }
  });
};

sendRequestBtn.addEventListener('click', () => {
  watchTargetLocation();
});
