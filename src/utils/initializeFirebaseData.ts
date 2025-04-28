
// import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
// import { db } from '@/config/firebase';
// // import { mockProducts } from '@/data/mockData';
// import { Product } from '@/types';

// export async function initializeProducts(): Promise<void> {
//   try {
//     // Check if products collection is empty
//     const productsSnapshot = await getDocs(collection(db, 'products'));
    
//     if (productsSnapshot.empty) {
//       console.log('Initializing Firebase with mock product data...');
      
//       // Add all mock products to Firestore
//       const batch = mockProducts.map(async (product: Product) => {
//         await setDoc(doc(db, 'products', product.id), product);
//       });
      
//       await Promise.all(batch);
//       console.log('Mock product data initialized successfully!');
//     } else {
//       console.log('Products collection already contains data, skipping initialization.');
//     }
//   } catch (error) {
//     console.error('Error initializing mock data:', error);
//   }
// }
