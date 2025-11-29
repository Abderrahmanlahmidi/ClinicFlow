import type { RootState } from "../store";

export const selectIsOpenClose = (state: RootState): boolean =>
  state.isOpenClose.isOpen;
