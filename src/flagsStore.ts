import { create } from "zustand";

type Toast = "currencyRateSuccess" | "credentailsSuccess";

type FlagsState = {
  toast: Record<Toast, boolean>;
  setToast: (toastName: Toast, shown: boolean) => void;
};

export const useFlagsStore = create<FlagsState>((set) => ({
  toast: {
    currencyRateSuccess: false,
    credentailsSuccess: false,
  },
  setToast: (name, shown) =>
    set((state) => ({
      ...state,
      toast: {
        ...state.toast,
        [name]: shown,
      },
    })),
}));
