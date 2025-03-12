import { setDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"
import { GithubAuthProvider, signInWithPopup, signOut, UserCredential } from "firebase/auth";

const saveKeyToDB = (userId: string, token: string) => new Promise((resolve, reject) => {
  setDoc(doc(db, "userTokens", userId), {
    githubToken: token
  }, { merge: true }).then(() => resolve(true)).catch((error) => reject(error))
})

const githubAuth = (): Promise<boolean> => {
  return new Promise<boolean>((resolve: (value: boolean) => void, reject: (reason: string) => void) => {
    const provider = new GithubAuthProvider();
    provider.addScope('user');
    provider.addScope('repo');
    provider.addScope('project');
    provider.addScope('admin:org');

    signInWithPopup(auth, provider)
      .then(async (result: UserCredential) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        console.log("Result: ", result);
        const credential = GithubAuthProvider.credentialFromResult(result);
        if (!credential) {
          signOut(auth);
          return reject("Unable to get Github token");
        }
        await saveKeyToDB(result.user.uid, credential.accessToken as string);
        resolve(true);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

const getKeyFromDB = (): Promise<string | null> => {
  return new Promise<string | null>((resolve, reject: (reason: string) => void) => {
    console.log("Load key from Firestore")
    const user = auth.currentUser;

    if (!user) {
      return reject("User not signed in");
    }

    const docRef = doc(db, 'userTokens', user.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        return resolve(data.githubToken || null);
      }
      reject("Token not found");
    }).catch((error) => reject(error.message));
  });
}

const logUserOut = () => signOut(auth)

export {
  getKeyFromDB,
  githubAuth,
  logUserOut
}
