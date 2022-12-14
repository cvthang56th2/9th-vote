import {
  setDoc,
  doc,
  Timestamp,
  onSnapshot,
  getDoc,
  collection,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../config'
import { snapshotToArray } from '../../utils/utils'

const DEVICES = 'devices'
class deviceServices {
  // #region device profile
  get(id) {
    try {
      return getDoc(doc(db, DEVICES, id))
    } catch (error) {
      console.log('error', error)
    }
  }

  create(id, data) {
    try {
      const { name } = data
      const today = new Date()
      return setDoc(doc(db, DEVICES, id), {
        updatedAt: Timestamp.fromDate(today),
        createdAt: Timestamp.fromDate(today),
        name
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  update(id, data) {
    try {
      return setDoc(
        doc(db, DEVICES, id),
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

  snapshotDevices (callback) {
    const q = query(collection(db, DEVICES), orderBy("createdAt", 'desc'))
    if (typeof this.unsubscribeDevices === 'function') {
      this.unsubscribeDevices()
    }
    this.unsubscribeDevices = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }
}

export default new deviceServices()
