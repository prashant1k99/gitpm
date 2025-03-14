import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"
import { GithubAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const saveKeyToDB = (userId: string, token: string) => new Promise((resolve, reject) => {
  setDoc(doc(db, "userTokens", userId), {
    githubToken: token
  }, { merge: true }).then(() => resolve(true)).catch((error) => reject(error))
})

const githubAuth = async () => {
  const provider = new GithubAuthProvider();
  provider.addScope('user');
  provider.addScope('repo');
  provider.addScope('project');
  provider.addScope('admin:org');

  const result = await signInWithPopup(auth, provider)
  console.log("Result: ", result);
  const credential = GithubAuthProvider.credentialFromResult(result);
  if (!credential) {
    signOut(auth);
    throw new Error("Unable to get Github token");
  }
  await saveKeyToDB(result.user.uid, credential.accessToken as string);
}

const getKeyFromDB = async () => {
  console.log("Load key from Firestore")
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not signed in")
  }

  const docRef = doc(db, 'userTokens', user.uid);
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.githubToken || null
  } else {
    throw new Error("Github token not found")
  }
}

const logUserOut = () => signOut(auth)

export {
  getKeyFromDB,
  githubAuth,
  logUserOut
}
