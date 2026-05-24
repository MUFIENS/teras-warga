"use client";

import { useState, useCallback } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

/**
 * useConfirmDialog — imperative confirmation dialog hook.
 *
 * Usage:
 * ```tsx
 * const { confirm, ConfirmDialog } = useConfirmDialog();
 *
 * const handleDelete = async () => {
 *   const ok = await confirm({
 *     title: "Hapus Postingan?",
 *     description: "Postingan akan dihapus secara permanen.",
 *     confirmText: "Hapus",
 *     variant: "danger",
 *   });
 *   if (ok) { ... }
 * };
 *
 * return <><ConfirmDialog />{...rest}</>
 * ```
 */
export function useConfirmDialog() {
  const [state, setState] = useState<ConfirmState | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      setState({ ...options, resolve });
    });
  }, []);

  const handleAction = useCallback(() => {
    state?.resolve(true);
    setState(null);
  }, [state]);

  const handleCancel = useCallback(() => {
    state?.resolve(false);
    setState(null);
  }, [state]);

  const variantStyles = {
    danger: "bg-red-500 text-white hover:bg-red-600",
    warning: "bg-amber-500 text-white hover:bg-amber-600",
    default: "bg-[#1D9BF0] text-white hover:bg-[#1A8CD8]",
  };

  const ConfirmDialog = useCallback(
    () => (
      <AlertDialog open={!!state} onOpenChange={(open) => !open && handleCancel()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state?.title}</AlertDialogTitle>
            {state?.description && (
              <AlertDialogDescription>{state.description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {state?.cancelText || "Batal"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              className={variantStyles[state?.variant || "default"]}
            >
              {state?.confirmText || "Konfirmasi"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
    [state, handleAction, handleCancel]
  );

  return { confirm, ConfirmDialog };
}
