import {
  setDoc,
  doc,
  Timestamp,
  onSnapshot,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '../config'
import { snapshotToArray } from '../../utils/utils'
import { uid } from 'uid'

const MEMBERS = 'members'
class memberServices {
  // #region member profile
  get(id) {
    try {
      return getDoc(doc(db, MEMBERS, id))
    } catch (error) {
      console.log('error', error)
    }
  }

  async create(data) {
    try {
      return new Promise(function(resolve, reject) {
        const { avatar, name } = data
        if (avatar && name) {
          const id = data.id || uid(20)
          const today = new Date()
          const file = avatar
          const storage = getStorage();
  
          
          // Upload file and metadata to the object 'images/mountains.jpg'
          const storageRef = ref(storage, `members/${new Date().getTime()}-${file.name}`);
          const uploadTask = uploadBytesResumable(storageRef, file);
  
          // Listen for state changes, errors, and completion of the upload.
          uploadTask.on('state_changed',
            (snapshot) => {
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  break;
                case 'running':
                  console.log('Upload is running');
                  break;
              }
            }, 
            (error) => {
              reject(error)
            }, 
            () => {
              // Upload completed successfully, now we can get the download URL
              getDownloadURL(uploadTask.snapshot.ref).then((avatarUrl) => {
                return setDoc(doc(db, MEMBERS, id), {
                  updatedAt: Timestamp.fromDate(today),
                  createdAt: Timestamp.fromDate(today),
                  avatar: avatarUrl,
                  name
                })
              });
            }
          );
        }
      });
    } catch (error) {
      throw new Error(error)
    }
  }

  snapshotMembers (callback) {
    const q = query(collection(db, 'members'), orderBy("createdAt", 'desc'))
    if (typeof this.unsubscribeMembers === 'function') {
      this.unsubscribeMembers()
    }
    this.unsubscribeMembers = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }

  async getAllMembers() {
    try {
      const loadConfig = query(collection(db, 'members'))
      const querySnapshot = await getDocs(loadConfig)
      return snapshotToArray(querySnapshot)
    } catch (error) {
      console.log('getAllMembers ==> error: ', error)
    }
  }

  async getMemberById(id) {
    try {
      const memberRef = doc(db, MEMBERS, id)
      const docSnap = await getDoc(memberRef)
      if (docSnap.exists()) {
        return docSnap.data()
      }
      return null
    } catch (error) {
      console.log('error', error)
    }
  }

  async getMembersInfo(datas) {
    try {
      const infos = await Promise.all(datas.map(uid => {
        return this.getMemberById(uid)
      }))
      return infos
    } catch (error) {
      console.log('getMembersInfo', error)
    }
  }

  update(id, data) {
    try {
      return setDoc(
        doc(db, MEMBERS, id),
        {
          ...data,
          updatedAt: Timestamp.fromDate(new Date())
        },
        { merge: true }
      )
    } catch (error) {
      console.log('error', error)
    }
  }
  remove(id) {
    try {
      return deleteDoc(doc(db, MEMBERS, id))
    } catch (error) {
      console.log('error', error)
    }
  }
}

export default new memberServices()
