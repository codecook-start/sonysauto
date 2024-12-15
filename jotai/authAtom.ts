import { atomWithStorage } from "jotai/utils";

export const authAtom = atomWithStorage<
  | {
      isAuthenticated: boolean;
    }
  | {
      isAuthenticated: boolean;
      user: {
        id: string;
        role: string;
      };
    }
>("auth", {
  isAuthenticated: false,
});

authAtom.debugLabel = "authAtom";
