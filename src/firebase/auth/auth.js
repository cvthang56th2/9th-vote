import { auth } from '../config'
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import UserServices from '../user/user'

class AuthServices {
  onAuthStateChanged(cb) {
    return onAuthStateChanged(auth, cb)
  }
  async register(email, password, options = {}) {
    const res = await createUserWithEmailAndPassword(auth, email, password)
    const { userName } = options
    const { uid } = res.user
    UserServices.create(uid, {
      email,
      uid,
      userName
    })
    return res
  }

  loginWithPhoneNumber(phoneNumber) {
    try {
      const verify = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible'
        },
        auth
      )
      return signInWithPhoneNumber(auth, phoneNumber, verify)
    } catch (err) {
      console.error('loginWithPhoneNumber', err)
    }
  }

  loginWithEmail(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  loginWithAnonymous() {
    return signInAnonymously(auth)
  }

  resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  async logout() {
    return signOut(auth)
  }
}

export default new AuthServices()
