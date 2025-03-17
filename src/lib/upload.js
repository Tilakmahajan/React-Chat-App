import React from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const upload = async (file) => {
  const storage = getStorage();
  const date = new Date().toISOString(); // Use a more standardized date format
  const storageRef = ref(storage, 'images/rivers.jpg');
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        reject(`Something went wrong: ${error.code}`);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            resolve(downloadURL);
          })
          .catch((error) => {
            reject(`Failed to get download URL: ${error}`);
          });
      }
    );
  });
};

export default upload;
