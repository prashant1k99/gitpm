import account from "@/lib/appwrite";
import { User as UserService } from "@/services/api/user";
import { signal } from "@preact/signals-react";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  githubUserName: string;
}

interface AppState {
  isAuthenticated: boolean;
  user: User | null;
  githubToken: string | null;
}

const authState = signal<AppState>({
  isAuthenticated: false,
  user: null,
  githubToken: null,
})

export const loadUser = async () => {
  try {
    const session = await account.getSession("current");

    const userService = new UserService(session.providerAccessToken);

    const userData = await userService.self

    if (userData.status != 200) {
      await account.deleteSession("current")
      throw new Error("Failed to fetch data")
    }

    authState.value = {
      isAuthenticated: true,
      user: {
        uid: session.providerUid,
        email: userData.data.email,
        displayName: userData.data.name,
        photoURL: userData.data.avatar_url,
        githubUserName: userData.data.login,
      },
      githubToken: session.providerAccessToken
    }

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export default authState
