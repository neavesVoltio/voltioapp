      // Import the functions you need from the SDKs you need
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
      import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
      // TODO: Add SDKs for Firebase products that you want to use
      // https://firebase.google.com/docs/web/setup#available-libraries
      import { getAuth, setPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjGrPx5FyahRLAAKNkyMS-7oqOVq5uJHo",
  authDomain: "voltioapp2.firebaseapp.com",
  projectId: "voltioapp2",
  storageBucket: "voltioapp2.appspot.com",
  messagingSenderId: "863200029523",
  appId: "1:863200029523:web:d90575429db1b472f80fa6"
};

      // Initialize Firebase
      export const app = initializeApp(firebaseConfig);
      export const analytics = getAnalytics(app);
      export const auth = getAuth(app)