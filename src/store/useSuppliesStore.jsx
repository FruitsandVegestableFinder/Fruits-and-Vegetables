// useAuthStore.js
// libraries
import { create } from 'zustand';
import { doc, addDoc, collection, serverTimestamp, getDoc, query, updateDoc, onSnapshot, deleteDoc, getDocs } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../config';
import { generateRandomId } from '../lib';

async function deleteImage(downloadURL) {
    try {
        const filePath = decodeURIComponent(downloadURL.split('/o/')[1].split('?')[0].replace(/%2F/g, '/'));
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef);
    } catch (error) {
    }
}

const useSuppliesStore = create((set) => ({
    supplies: [],
    imgErr: null,
    getAllSupplies: async () => {
        try {
            const complaintsCollection = collection(db, 'supplies');
            const q = query(complaintsCollection);

            const unsubscribe = onSnapshot(q, async (snapshot) => {
            const suppliesList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const userPromises = suppliesList.map(async supplies => {
                const userDoc = await getDoc(doc(db, 'users', supplies.userId));
                if(userDoc.exists()){
                    const user = userDoc.data();
                    return { ...supplies, fullName: user.fullName, email: user.email, contactNumber: user.contactNumber };
                } else {
                    return { ...supplies };
                }
            });

            const suppliesWithUsers = await Promise.all(userPromises);
                set({ supplies: suppliesWithUsers });
            });

            return unsubscribe;
        } catch (err) {
            
        }
    },
    addSupplies: async (userId, type, name, img) => {
        const suppliesSnapshot = await getDocs(collection(db, 'supplies'));
        const lowerName = name.toLowerCase();

        const isDuplicate = suppliesSnapshot.docs.some(doc => {
            const data = doc.data();
            return data.name?.toLowerCase() === lowerName;
        });

        if (isDuplicate) {
            return { err: 'Supply is already exist.' };
        }

        let imgUrl = '';
        try {
            const storageRef = ref(storage, `images/${generateRandomId()}`);
            const uploadTask = uploadBytesResumable(storageRef, img);
      
            // Wait for each upload task to complete
            await new Promise((resolve, reject) => {
              uploadTask.on(
                'state_changed',
                (snapshot) => {
                  // Handle progress if needed
                },
                (error) => {
                  reject('Error uploading file');
                },
                () => {
                  // Upload completed successfully, get download URL
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        imgUrl = downloadURL;
                        resolve();
                    })
                    .catch((e) => {
                      set({ imgErr: 'Something went wrong, please try again.' });
                      reject('Error getting download URL');
                    });
                }
              );
            });
        } catch (error) {
            set({ imgErr: 'Something went wrong, please try again.' });
        }

        const newSupplies = {
            userId,
            type,
            name,
            imgUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await addDoc(collection(db, 'supplies'), newSupplies);
        return { success: 'Added successfully.', supplyName: name };
    },
    createNotification: async(supplyName) => {
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

        for (const user of usersOnly) {
            const notification = {
              userId: user.id,
              notification: `New Supply: ${supplyName} added.`,
              isRead: false,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
          
            await addDoc(collection(db, 'notifications'), notification);
        }
    },
    editSupplies: async (userId, type, name, id, prev, img) => {
        let imgUrl = prev;
        if(img){ 
            try {
                const storageRef = ref(storage, `images/${generateRandomId()}`);
                const uploadTask = uploadBytesResumable(storageRef, img);
        
                // Wait for each upload task to complete
                await new Promise((resolve, reject) => {
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                    // Handle progress if needed
                    },
                    (error) => {
                    reject('Error uploading file');
                    },
                    () => {
                    // Upload completed successfully, get download URL
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            imgUrl = downloadURL;
                            deleteImage(prev);
                            resolve();
                        })
                        .catch((e) => {
                        set({ imgErr: 'Something went wrong, please try again.' });
                        reject('Error getting download URL');
                        });
                    }
                );
                });
            } catch (error) {
                set({ imgErr: 'Something went wrong, please try again.' });
            }

        }

        const newSupplies = {
            userId,
            type,
            name,
            imgUrl,
            updatedAt: serverTimestamp(),
        };

        const supplyRef = doc(db, "supplies", id);
        await updateDoc(supplyRef, newSupplies);

        return { success: 'Updated successfully.' };
    },
    deleteSupplies: async (suppliesArr) => {
        for (const supply of suppliesArr) {
            const supplyRef = doc(db, "supplies", supply);
            const supplyDoc = await getDoc(supplyRef);
            if(supplyDoc.exists()){
                const suppl = supplyDoc.data();
                deleteImage(suppl.imgUrl);
            }
            await deleteDoc(supplyRef);
        }
    }
}));

export default useSuppliesStore;