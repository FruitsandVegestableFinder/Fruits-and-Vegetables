// useSuppliersStore.js
import { create } from 'zustand';
import { doc, collection, serverTimestamp, addDoc, getDocs, getDoc, query, where, updateDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db, storage } from '../config';
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { generateRandomId } from '../lib';

async function deleteImage(downloadURL) {
  try {
      const filePath = decodeURIComponent(downloadURL.split('/o/')[1].split('?')[0].replace(/%2F/g, '/'));
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
  } catch (error) {
  }
}

const useSuppliersStore = create((set) => ({
    suppliers: [],
    emergency: {},
    supplierError: null,
    supplierSuccess: null,
    getAllSuppliers: async () => {
        try {
            const suppliersCollection = collection(db, 'suppliers');
            const q = query(suppliersCollection);

            const unsubscribe = onSnapshot(q, async (snapshot) => {
            const supplierList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const userPromises = supplierList.map(async supplier => {
                const userDoc = await getDoc(doc(db, 'users', supplier.createdBy));
                
                let supplyList = [];
                supplier.supplyLists.map(async supl => {
                    const supplyDoc = await getDoc(doc(db, 'supplies', supl));
                    supplyList.push(supplyDoc.data());
                });

                if(userDoc.exists()){
                    const user = userDoc.data();
                    if(user){
                        return { ...supplier, supplyListsData: supplyList, createdBy: user.fullName };
                    } else {
                        return { ...supplier, supplyListsData: supplyList, createdBy: 'Unknown' };
                    }
                } else {
                    return { ...supplier, supplyListsData: supplyList, createdBy: 'Unknown' };
                }
            });

            const suppliersWithUsers = await Promise.all(userPromises);
            set({ suppliers: suppliersWithUsers });
            });

            return unsubscribe;
        } catch (err) {
            
        }
    },
    addSuppliers: async (formData, image, imageProfile, supplyLists) => {
        let imgProfile = '';
        if(imageProfile){ 
          try {
            const storageRef = ref(storage, `images/${generateRandomId()}`);
            const uploadTask = uploadBytesResumable(storageRef, imageProfile);
      
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
                      imgProfile = downloadURL;
                      resolve();
                    })
                    .catch((e) => {
                      set({ supplierError: 'Something went wrong, please try again.' });
                      reject('Error getting download URL');
                    });
                }
              );
            });
          } catch (error) {
              set({ supplierError: 'Something went wrong, please try again.' });
              console.log(error)
          }
        }

        const imageUrls = [];
        for (const img of image) {
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
                        imageUrls.push(downloadURL);
                        resolve();
                      })
                      .catch((e) => {
                        set({ supplierError: 'Something went wrong, please try again.' });
                        reject('Error getting download URL');
                      });
                  }
                );
              });
            } catch (error) {
                set({ supplierError: 'Something went wrong, please try again.' });
                console.log(error)
            }
        }
    
        // After all images are uploaded and URLs are obtained, create the new supplier
        const newSupplier = {
            supplierName: formData.supplierName,
            createdBy: formData.createdBy,
            storeName: formData.storeName,
            address: formData.address,
            description: formData.description,
            contactNumber: formData.contactNumber,
            latitude: formData.latitude,
            longitude: formData.longitude,
            supplyLists: supplyLists,
            imageUrls: imageUrls,
            imageProfile: imgProfile,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };
    
        await addDoc(collection(db, 'suppliers'), newSupplier);
        set({ supplierSuccess: 'Supplier added successfully.' });
    },
    updateSuppliers: async (formData, image, supplyLists, prevImg, id, imageProfile, prevProfile) => {
      let imgProfile = prevProfile || '';
      if(imageProfile){
        await deleteImage(imgProfile);

        let newImageProfileUrl = '';
        try {
          const storageRef = ref(storage, `images/${generateRandomId()}`);
          const uploadTask = uploadBytesResumable(storageRef, imageProfile);
    
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
                    newImageProfileUrl = downloadURL;
                    resolve();
                  })
                  .catch((e) => {
                    set({ supplierError: 'Something went wrong, please try again.' });
                    reject('Error getting download URL');
                  });
              }
            );
          });
        } catch (error) {
            set({ supplierError: 'Something went wrong, please try again.' });
        }

        imgProfile = newImageProfileUrl;
      }

      let imageUrls = prevImg || [];
      if(image.length > 0){
        for(const url of imageUrls){
          await deleteImage(url);
        }

        let newImageUrls = [];
        for (const img of image) {
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
                        newImageUrls.push(downloadURL);
                        resolve();
                      })
                      .catch((e) => {
                        set({ supplierError: 'Something went wrong, please try again.' });
                        reject('Error getting download URL');
                      });
                  }
                );
              });
            } catch (error) {
                set({ supplierError: 'Something went wrong, please try again.' });
                console.log(error)
            }
        }

        imageUrls = newImageUrls;
      }
  
      // After all images are uploaded and URLs are obtained, create the new supplier
      const newSupplier = {
          createdBy: formData.createdBy,
          supplierName: formData.supplierName,
          storeName: formData.storeName,
          address: formData.address,
          description: formData.description,
          contactNumber: formData.contactNumber,
          latitude: formData.latitude,
          longitude: formData.longitude,
          supplyLists: supplyLists,
          imageUrls: imageUrls,
          imageProfile: imgProfile,
          updatedAt: serverTimestamp(),
      };

      const supplieref = doc(db, "suppliers", id);
      await updateDoc(supplieref, newSupplier);
    },
    deleteSuppliers: async (suppliersArr) => {
      for (const supplier of suppliersArr) {
          const supplierRef = doc(db, "suppliers", supplier);
          const supplierDoc = await getDoc(supplierRef);
          if(supplierDoc.exists()){
              const suppl = supplierDoc.data();
              for(const suplr of suppl.imageUrls){
                deleteImage(suplr);
              }
          }
          await deleteDoc(supplierRef);
      }
    }
}));

export default useSuppliersStore;