 // Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyAVp5CtsglGVw5Zjdbbf_dJZpGdgoTkPSI",
    authDomain: "authentication-12298.firebaseapp.com",
    databaseURL: "https://authentication-12298-default-rtdb.firebaseio.com",
    projectId: "authentication-12298",
    storageBucket: "authentication-12298.firebasestorage.app",
    messagingSenderId: "414945602397",
    appId: "1:414945602397:web:992285ca199707cd1956b4",
    measurementId: "G-F2YC2XWHBW"
  };

      
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
        import { getAuth, signInWithEmailAndPassword, RecaptchaVerifier, PhoneAuthProvider, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        let recaptchaVerifier;

        // Initialize ReCAPTCHA
        function setupReCAPTCHA() {
            recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                size: 'invisible',
                callback: () => {
                    console.log('ReCAPTCHA verified');
                }
            }, auth);
        }

        // Login with Email and Password
        document.getElementById('loginBtn').addEventListener('click', async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Logged in successfully:', userCredential.user);
                document.getElementById('login-form').style.display = 'none';
                document.getElementById('phone-form').style.display = 'block';
                setupReCAPTCHA();
            } catch (error) {
                console.error('Login Error:', error.message);
                alert("Invalid email or password. Please try again.");
            }
        });

        // Send SMS Verification Code
        document.getElementById('sendCodeBtn').addEventListener('click', async () => {
            const phoneNumber = document.getElementById('phone').value;
            if (!phoneNumber.startsWith('+')) {
                alert('Please enter the phone number in E.164 format (e.g., +1234567890).');
                return;
            }
            try {
                const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
                window.confirmationResult = confirmationResult;
                console.log('SMS sent!');
                alert('Verification code sent to your phone.');
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                alert(`Error: ${error.message}`);
            }
        });

       // Verify the SMS Code
document.getElementById('verifyCodeBtn').addEventListener('click', async () => {
    const code = document.getElementById('verificationCode').value;
    try {
        const credential = PhoneAuthProvider.credential(window.confirmationResult.verificationId, code);
        const userCredential = await signInWithCredential(auth, credential);
        console.log('Phone verified and signed in:', userCredential.user);
        alert('Authentication successful!');
    } catch (error) {
        console.error('Error verifying code:', error.message);
        alert(`Verification failed: ${error.message}`);
    }
});