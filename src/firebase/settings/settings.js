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

const SETTINGS = 'settings'
class settingServices {
  // #region device profile
  async get(id) {
    try {
      const res = await getDoc(doc(db, SETTINGS, id))
      return res.data()
    } catch (error) {
      console.log('error', error)
    }
  }

  update(id, data) {
    try {
      return setDoc(
        doc(db, SETTINGS, id),
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
}

export default new settingServices()
