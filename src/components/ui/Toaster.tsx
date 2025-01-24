import { useToast } from "@/hooks/useToast";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed z-50 flex flex-col gap-2 top-4 right-4">
      {toasts &&
        toasts?.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-md p-4 text-white shadow-lg transition-all ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                ? "bg-red-500"
                : toast.type === "warning"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
          >
            <button
              onClick={() => removeToast(toast.id)}
              className="float-right ml-4 hover:opacity-75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-x"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </button>
            {toast.message}
          </div>
        ))}
    </div>
  );
}
