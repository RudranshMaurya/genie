import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  serverTimestamp,
} from 'firebase/database';
import { rtdb } from './firebase';
import type { Wish, WishStatus, GenieMessage } from '../types';

const STORAGE_KEY_WISHES = 'genie_stored_wishes_backup';
const STORAGE_KEY_MESSAGES = 'genie_stored_messages_backup';

function getLocalWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WISHES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveLocalWishes(wishes: Wish[]) {
  try {
    localStorage.setItem(STORAGE_KEY_WISHES, JSON.stringify(wishes));
  } catch (e) {
    console.error(e);
  }
}

function getLocalMessages(): GenieMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

function saveLocalMessages(messages: GenieMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error(e);
  }
}

// 1. Subscribe to real-time wishes from Firebase Realtime Database
export function subscribeToWishes(onUpdate: (wishes: Wish[]) => void): () => void {
  try {
    const wishesRef = ref(rtdb, 'wishes');
    const unsubscribe = onValue(
      wishesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          saveLocalWishes([]);
          onUpdate([]);
          return;
        }

        const wishesList: Wish[] = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            id: key,
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'Wish',
            imageUrl: item.imageUrl || '',
            createdAt: typeof item.createdAt === 'number' 
              ? new Date(item.createdAt).toISOString() 
              : (item.createdAt || new Date().toISOString()),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : undefined,
            completedAt: item.completedAt ? new Date(item.completedAt).toISOString() : undefined,
            expectedCompletionAt: item.expectedCompletionAt || undefined,
            status: item.status || 'WISH RECEIVED',
            adminResponse: item.adminResponse || '',
            priority: item.priority || 'normal',
            userUid: item.userUid || '',
            userName: item.userName || 'Ananya',
          };
        });

        // Sort descending by creation date (newest first)
        wishesList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        saveLocalWishes(wishesList);
        onUpdate(wishesList);
      },
      (error) => {
        console.warn('Firebase RTDB error, using local fallback:', error);
        onUpdate(getLocalWishes());
      }
    );

    return () => unsubscribe();
  } catch (err) {
    console.warn('Falling back to local wish subscription:', err);
    onUpdate(getLocalWishes());
    const handleStorage = () => onUpdate(getLocalWishes());
    window.addEventListener('genie-local-update', handleStorage);
    return () => window.removeEventListener('genie-local-update', handleStorage);
  }
}

// 2. Create a new wish in Firebase Realtime Database
export async function createWish(wishData: {
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  userUid?: string;
  userName?: string;
}): Promise<Wish> {
  const newWish: Wish = {
    id: `wish-${Date.now()}`,
    title: wishData.title.trim(),
    description: (wishData.description || wishData.title).trim(),
    category: wishData.category || 'Wish',
    imageUrl: wishData.imageUrl || '',
    status: 'WISH RECEIVED',
    createdAt: new Date().toISOString(),
    userUid: wishData.userUid || 'ananya-user',
    userName: wishData.userName || 'Ananya',
  };

  try {
    const wishesRef = ref(rtdb, 'wishes');
    const newDocRef = push(wishesRef);
    const generatedId = newDocRef.key || newWish.id;
    newWish.id = generatedId;

    await set(newDocRef, {
      ...newWish,
      createdAt: Date.now(),
    });

    console.log('✅ Wish successfully saved to Firebase Realtime Database:', newWish.id);
  } catch (error) {
    console.error('Firebase wish save failed:', error);
  }

  // Also update local cache immediately for zero-delay UI update in cart
  const current = getLocalWishes();
  const updated = [newWish, ...current.filter((w) => w.id !== newWish.id)];
  saveLocalWishes(updated);
  window.dispatchEvent(new Event('genie-local-update'));

  return newWish;
}

// 3. Update wish status and admin response in Firebase Realtime Database
export async function updateWishByAdmin(
  wishId: string,
  updates: {
    status?: WishStatus;
    adminResponse?: string;
    expectedCompletionAt?: string | null;
    priority?: 'normal' | 'high' | 'special';
  }
): Promise<void> {
  const patch: Record<string, any> = {
    ...updates,
    updatedAt: Date.now(),
  };

  if (updates.status === 'WISH GRANTED') {
    patch.completedAt = Date.now();
  } else if (updates.status) {
    patch.completedAt = null;
  }

  try {
    const wishRef = ref(rtdb, `wishes/${wishId}`);
    await update(wishRef, patch);
    console.log('✅ Wish updated in Firebase:', wishId);
  } catch (e) {
    console.error('Firebase update failed:', e);
  }

  const wishes = getLocalWishes();
  const updatedWishes: Wish[] = wishes.map((w) => {
    if (w.id === wishId) {
      return {
        ...w,
        status: updates.status || w.status,
        adminResponse: updates.adminResponse !== undefined ? updates.adminResponse : w.adminResponse,
        expectedCompletionAt: updates.expectedCompletionAt || undefined,
        priority: updates.priority || w.priority,
        completedAt: updates.status === 'WISH GRANTED' ? new Date().toISOString() : undefined,
      };
    }
    return w;
  });
  saveLocalWishes(updatedWishes);
  window.dispatchEvent(new Event('genie-local-update'));
}

// 4. Delete a wish from Firebase Realtime Database
export async function deleteWish(wishId: string): Promise<void> {
  try {
    const wishRef = ref(rtdb, `wishes/${wishId}`);
    await remove(wishRef);
    console.log('✅ Wish deleted from Firebase:', wishId);
  } catch (e) {
    console.error('Firebase delete failed:', e);
  }

  const wishes = getLocalWishes();
  const updated = wishes.filter((w) => w.id !== wishId);
  saveLocalWishes(updated);
  window.dispatchEvent(new Event('genie-local-update'));
}

// 5. Subscribe to Genie Messages in Firebase Realtime Database
export function subscribeToMessages(onUpdate: (messages: GenieMessage[]) => void): () => void {
  try {
    const msgRef = ref(rtdb, 'messages');
    const unsubscribe = onValue(
      msgRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          onUpdate(getLocalMessages());
          return;
        }

        const list: GenieMessage[] = Object.keys(data).map((key) => {
          const item = data[key];
          return {
            id: key,
            title: item.title || '',
            content: item.content || '',
            createdAt: typeof item.createdAt === 'number'
              ? new Date(item.createdAt).toISOString()
              : (item.createdAt || new Date().toISOString()),
            active: item.active ?? true,
            author: item.author || 'Your Genie',
          };
        });

        saveLocalMessages(list);
        onUpdate(list);
      },
      () => {
        onUpdate(getLocalMessages());
      }
    );

    return () => unsubscribe();
  } catch {
    onUpdate(getLocalMessages());
    return () => {};
  }
}

// 6. Save a Genie Message to Firebase Realtime Database
export async function saveGenieMessage(msg: {
  id?: string;
  title: string;
  content: string;
  active?: boolean;
}) {
  try {
    if (msg.id) {
      const specificRef = ref(rtdb, `messages/${msg.id}`);
      await update(specificRef, {
        title: msg.title,
        content: msg.content,
        active: msg.active ?? true,
        updatedAt: Date.now(),
      });
    } else {
      const msgListRef = ref(rtdb, 'messages');
      const newRef = push(msgListRef);
      await set(newRef, {
        title: msg.title,
        content: msg.content,
        active: true,
        createdAt: Date.now(),
        author: 'Your Genie',
      });
    }
  } catch (e) {
    console.error('Failed to save message:', e);
  }
}
