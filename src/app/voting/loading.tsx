import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1D9BF0]" />
    </div>
  );
}
