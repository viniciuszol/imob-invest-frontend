import { X } from "lucide-react";

export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="
  bg-gray-900
  p-6
  rounded-2xl
  w-full
  max-w-2xl
  max-h-[75vh]
  overflow-y-auto
  shadow-xl 
  border 
  border-gray-700
">
        <div className="flex justify-between mb-2 sticky margin-bottom-10 bg-gray-900 z-10">
          <h3 className="text-xl truncate">{title}</h3>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-400 hover:text-white transition"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
