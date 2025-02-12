// import {
//   getStorage,
//   ref,
//   deleteObject,
//   getDownloadURL,
//   uploadBytesResumable,
// } from "firebase/storage";
// import { initializeApp } from "firebase/app";
// import { FirebaseOptions } from "firebase/app";

// // Initialize Firebase (ensure firebaseConfig is properly typed)
// const firebaseConfig: FirebaseOptions = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };
// initializeApp(firebaseConfig);

// // Initialize Cloud Storage
// const storage = getStorage();

// // Define the file type
// interface FileData {
//   originalname: string;
//   mimetype: string;
//   buffer: Buffer;
// }

// export const FirebaseImageHandler = {
//   uploadImage: async (
//     file: FileData
//   ): Promise<{ name: string; type: string; downloadURL: string }> => {
//     try {
//       const dateTime = giveCurrentDateTime();
//       const storageRef = ref(
//         storage,
//         `images/${file.originalname + " " + dateTime}`
//       );

//       const metadata = {
//         contentType: file.mimetype,
//       };

//       // Upload the file
//       const snapshot = await uploadBytesResumable(
//         storageRef,
//         file.buffer,
//         metadata
//       );

//       // Get the download URL
//       const downloadURL = await getDownloadURL(snapshot.ref);

//       return {
//         name: file.originalname,
//         type: file.mimetype,
//         downloadURL,
//       };
//     } catch (error) {
//       throw new Error((error as Error).message);
//     }
//   },

//   deleteImage: async (imageUrl: string): Promise<boolean> => {
//     try {
//       if (!imageUrl) return false;

//       // Extract the full path from the URL
//       const urlPath = decodeURIComponent(
//         imageUrl.split("/o/")[1].split("?")[0]
//       );
//       const imageRef = ref(storage, urlPath);

//       // Delete the file
//       await deleteObject(imageRef);
//       return true;
//     } catch (error) {
//       throw new Error((error as Error).message);
//     }
//   },

//   updateImage: async (
//     oldImageUrl: string,
//     newImage: FileData
//   ): Promise<{ name: string; type: string; downloadURL: string } | false> => {
//     try {
//       if (!oldImageUrl || !newImage) return false;

//       await FirebaseImageHandler.deleteImage(oldImageUrl);
//       const image = await FirebaseImageHandler.uploadImage(newImage);

//       return image;
//     } catch (error) {
//       throw new Error((error as Error).message);
//     }
//   },
// };

// // Helper function to get current date and time
// const giveCurrentDateTime = (): string => {
//   const today = new Date();
//   const date = `${today.getFullYear()}-${
//     today.getMonth() + 1
//   }-${today.getDate()}`;
//   const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
//   return `${date} ${time}`;
// };
