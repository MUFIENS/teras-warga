import { toast } from "sonner";

export function showSuccess(title: string, description?: string) {
  toast.success(title, { description });
}

export function showError(title: string, description?: string) {
  toast.error(title, { description });
}

export function showWarning(title: string, description?: string) {
  toast.warning(title, { description });
}

export function showInfo(title: string, description?: string) {
  toast.info(title, { description });
}

/**
 * Show a loading toast. Returns the toast ID so you can dismiss or update it.
 * Usage:
 *   const id = showLoading("Mengunggah...");
 *   // ...after done...
 *   toast.dismiss(id);
 *   // or update:
 *   toast.success("Selesai!", { id });
 */
export function showLoading(title: string) {
  return toast.loading(title);
}

// Re-export toast for advanced usage
export { toast };
