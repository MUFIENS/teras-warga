import SwalOriginal, { SweetAlertOptions } from "sweetalert2";

const BaseSwal = SwalOriginal.mixin({
  customClass: {
    popup: "bg-white dark:bg-[#1c1c1c] rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden p-0 relative font-sans",
    header: "w-full m-0 p-0 border-0 flex flex-col",
    title: "w-full flex items-center justify-start gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-neutral-800 m-0 font-bold text-lg text-gray-900 dark:text-white text-left",
    closeButton: "absolute top-3 right-4 p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors focus:outline-none text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 z-10",
    htmlContainer: "px-6 py-6 m-0 text-left text-gray-600 dark:text-gray-300 text-[15px] leading-relaxed",
    actions: "px-6 pb-6 pt-0 w-full flex gap-3 m-0",
    confirmButton: "w-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold py-3 px-4 rounded-full transition-colors active:scale-95 focus:outline-none flex-1",
    cancelButton: "w-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-full transition-colors active:scale-95 focus:outline-none flex-1",
    denyButton: "w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-full transition-colors active:scale-95 focus:outline-none flex-1",
  },
  buttonsStyling: false,
  showCloseButton: true,
  backdrop: "rgba(0,0,0,0.6)",
  // Removed background: transparent to allow Tailwind bg-white / bg-[#1c1c1c] to work
});

// Override fire to automatically inject the Lucide-style SVG icon into the title
const fireOverride = async function(...args: any[]) {
  let opts: SweetAlertOptions = {};
  
  if (typeof args[0] === 'string') {
    opts.title = args[0];
    opts.html = args[1];
    opts.icon = args[2] as any;
  } else {
    opts = { ...args[0] };
  }

  const iconType = opts.icon;
  delete opts.icon; // Hide the standard giant icon

  // Create inline SVG icons resembling Lucide React
  let iconSvg = '';
  if (iconType === 'success') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else if (iconType === 'error') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 flex-shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else if (iconType === 'warning') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 flex-shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  } else if (iconType === 'info' || iconType === 'question') {
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-[#1D9BF0] flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  // Wrap the original title with the icon
  const originalTitle = opts.title || '';
  opts.title = `<div class="flex items-center gap-2.5 w-full">${iconSvg}<span class="flex-1 truncate">${originalTitle}</span></div>`;

  return BaseSwal.fire(opts);
};

// Create the final proxy object
export const CustomSwal = Object.assign(
  function(...args: any[]) { return fireOverride(...args); },
  BaseSwal,
  { fire: fireOverride }
) as typeof SwalOriginal;

export const swalTheme = () => ({});
