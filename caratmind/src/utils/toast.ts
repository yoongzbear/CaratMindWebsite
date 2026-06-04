// instead of toast(), call print()
import { toast, TypeOptions } from 'react-toastify';

export function print(_message: string, _type: TypeOptions) {
  toast(_message, {
    type: _type,
    position: 'bottom-right',
  });
}

export function toastError(message: string) {
  toast(message, { type: 'error', position: 'bottom-right' });
}

export function toastSuccess(message: string) {
  toast(message, { type: 'success', position: 'bottom-right' });
}
