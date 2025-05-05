// useAuthStore.js
// libraries
import { create } from 'zustand';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc, addDoc, collection } from 'firebase/firestore';

// firebase config
import { auth, db } from '../config';

const useAuthStore = create((set) => ({
  // define infos
  userInfo: null,
  registerError: {},
  loginError: null,
  resetError: null,
  resetSuccess: null,
  updateError: null,
  updateSuccessPassword: null,
  updateSuccessProfile: null,
  initializeAuth: () => { //get auth if logged in or not and add user data to userInfo 
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userr = await getDoc(userRef);
        
        if (userr.exists()) {
            const userData = userr.data();
            set({ userInfo: { id: user.uid, ...userData } });
        }
      }
    });
  },
  signIn: async (email, password) => { // sign in using email and password
    try {
        await signInWithEmailAndPassword(auth, email, password);
        const newLogs = {
            userId: 'Administrator',
            log: `Logged in an account.`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
    
        await addDoc(collection(db, 'logs'), newLogs);
        set({ loginError: null});
    } catch (error) {
        set({ loginError: 'Email and Password do not match.' });
    }
  },
  signUp: async (email, password, confirmPassword, fullName, contactNumber, address) => { // get data and insert to firbase
    if (password !== confirmPassword) {
        set({ registerError: { passwordConfirm: "Passwords do not match!" }});
        return;
    }
    if (password.length < 8 || password.length > 16) {
        set({ registerError: { password: "Password must be between 8 and 16 characters" }});
        return;
    }
    if (contactNumber.length < 11) {
        set({ registerError: { contactNumber: "Please enter a valid contact number" }});
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        if (userCredential) {
          const userRef = doc(db, "users", user.uid);
          await setDoc(userRef, {
            fullName,
            email,
            contactNumber,
            address,
            userType: 1,
            favorites: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          const newLogs = {
            userId: 'Administrator',
            log: `Created an account.`,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
      
          await addDoc(collection(db, 'logs'), newLogs);
        }
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            set({ registerError: { email: 'Already in used.' }});
        } else {
            set({ registerError: { other: 'Something went wrong. Please try again.' }});
        }
    }
  },
  updateProfile: async (email, password, confirmPassword, oldPassword, fullName, address, contactNumber, id) => { // get data and update profile
    if(oldPassword != '' || password != ''){
      if(password == ''){
        set({ updateError: { password: "Please Enter New Password" }});
        return;
      }
      
      if(oldPassword == ''){
        set({ updateError: { oldPassword: "Please Enter Old Password" }});
        return;
      }

      if (password !== confirmPassword) {
        set({ updateError: { passwordConfirm: "Passwords do not match!" }});
        return;
      }
      if (password.length < 8 || password.length > 16) {
        set({ updateError: { password: "Password must be between 8 and 16 characters" }});
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, oldPassword);
        
        onAuthStateChanged(auth, async (user) => {
          if(user){
            const newPassword = password;
            await updatePassword(user, newPassword);
            set({ updateSuccessPassword: 'Password updated successfully.' });
          }
        })
      } catch (error) {
          set({ updateError: { oldPassword: 'Password incorrect.'} });
      }
    }

    if(fullName == '') return;
    if(contactNumber == '') return;
    if(address == '') return;
    
    try{
      const userRef = doc(db, "users", id);
      const docSnap = await getDoc(userRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if(fullName == userData.fullName && contactNumber == userData.contactNumber && address == userData.address){
          return;
        }

        await updateDoc(userRef, {
          fullName,
          contactNumber,
          address,
          updatedAt: serverTimestamp()
        });
  
        set({ updateSuccessProfile: 'Profile updated successfully.' });
  
        const userr = await getDoc(userRef);
        if (userr.exists()) {
          const userData = userr.data();
          set({ userInfo: { id, ...userData } });
        }
      } else {
        set({ updateError: { other: 'No user found.' } });
      }
    } catch(e){
      set({ updateError: { other: 'Something went wrong, please try again' } });
    }
  },
  resetAccount: async (email) => { // reset account 
    try {
      await sendPasswordResetEmail(auth, email);
        set({  resetSuccess: 'Password reset email sent.' });
        const newLogs = {
          userId: 'Administrator',
          log: `Password Reset sent to ${email}`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
    
        await addDoc(collection(db, 'logs'), newLogs);
      } catch (error) {
        set({ resetError: 'Email not found.' });
      }
  },
  signOut: async () => { // remove auth in web browser and empty value of userInfo
    await auth.signOut();
    set({ userInfo: null });
  },
  setLoginError: () => { // remove login error message
    set({ loginError: null });
  },
  setRegisterError: () => { // remove register error message
    set({ registerError: {} });
  },
  setUpdateError: () => { // remove update error message
    set({ updateError: {} });
  },
  setUpdateSuccess: () => { // remove success message
    set({ updateSuccessPassword: null });
    set({ updateSuccessProfile: null });
  },
  setResetError: () => { // remove reset password error message
    set({ resetError: null });
  },
  setResetSuccess: () => { // remove reset password success message
    set({ resetSuccess: null });
  },
}));

export default useAuthStore;
