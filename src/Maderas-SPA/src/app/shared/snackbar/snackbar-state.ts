import { SnackbarMessageType } from './snackbar-message-type';

export interface SnackbarState {
  message: string;
  type: SnackbarMessageType;
}
