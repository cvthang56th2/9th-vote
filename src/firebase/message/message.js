import {
  setDoc,
  doc,
  query,
  orderBy,
  collection,
  onSnapshot,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../config'
import { uid } from 'uid'
import { snapshotToArray } from '../../utils/utils'

const MESSAGEHISTORY = 'messageHistory'
const MESSAGE = 'message'

class messageServices {
  async createMessage(groupId, data) {
    if (!groupId) return
    const id = data.id || uid(20)
    try {
      const today = new Date()
      const ref = doc(db, MESSAGEHISTORY, groupId, MESSAGE, id)
      data.id = id
      const result = await setDoc(ref, {
        updatedAt: Timestamp.fromDate(today),
        createdAt: Timestamp.fromDate(today),
        ...data
      })
      return { id }
    } catch (err) {
      console.error('error create message', err)
    }
  }

  async updateMessage(groupId, messageId, data) {
    if (!groupId) return
    try {
      console.log('db, MESSAGEHISTORY, groupId, MESSAGE, messageId :>> ',  groupId, messageId, data);
      const ref = doc(db, MESSAGEHISTORY, groupId, MESSAGE, messageId)
      return updateDoc(ref, {
        updatedAt: Timestamp.fromDate(today),
        ...data
      })
    } catch (err) {
      console.error('error update message', err)
    }
  }

  getGroupMessages(groupId, callback) {
    const q = query(collection(db, MESSAGEHISTORY, groupId, MESSAGE), orderBy("createdAt"))
    if (typeof this.unsubscribeGroupMessages === 'function') {
      this.unsubscribeGroupMessages()
    }
    this.unsubscribeGroupMessages = onSnapshot(q, querySnapshot => {
      if (typeof callback === 'function')  {
        callback(snapshotToArray(querySnapshot))
      }
    });
  }
}

export default new messageServices()
