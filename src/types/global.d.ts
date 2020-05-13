import { Store } from '@/store';

declare global {
  interface Window {
    __NEXT_REDUX_STORE__?: Store;
  }
}
