// useUserStore.js
import { create } from 'zustand';
import { db } from '../config'; // Adjust the import path based on your project structure
import { collection, query, getDocs, where } from 'firebase/firestore';

const useUserStore = create((set) => ({
    users: [],
    getUsers: async () => {
        try {
            const usersCollection = collection(db, 'users');
            const q = query(usersCollection);
            const usersSnapshot = await getDocs(q);
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const usersOnly = usersList.filter(user => {
                return user.userType == 2;
            });

            set({ users: usersOnly });
        } catch (err) {
            
        }
    }
}));

export default useUserStore;