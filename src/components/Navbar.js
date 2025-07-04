import {
  HomeIcon,
  CurrencyRupeeIcon,
  GiftIcon,
  ClipboardDocumentCheckIcon,
  PhotoIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: <HomeIcon className="w-6 h-6" />, label: "Home" },
  { to: "/expenses", icon: <CurrencyRupeeIcon className="w-6 h-6" />, label: "Expenses" },
  { to: "/contributions", icon: <GiftIcon className="w-6 h-6" />, label: "Contributions" },
  { to: "/tasks", icon: <ClipboardDocumentCheckIcon className="w-6 h-6" />, label: "Tasks" },
  { to: "/gallery", icon: <PhotoIcon className="w-6 h-6" />, label: "Gallery" },
  { to: "/sponsors", icon: <UserGroupIcon className="w-6 h-6" />, label: "Sponsors" },
  { to: "/chat", icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />, label: "Chat" },
];

export default function BottomNavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-[430px] max-w-[95vw] pb-2">
      <div
        className="mx-auto flex justify-between items-center bg-white/80 rounded-2xl shadow-lg border-2 border-yellow-400 px-3 py-2"
        style={{
          backdropFilter: "blur(8px)",
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center text-xs ${
              location.pathname === item.to
                ? "text-[#E65100]"
                : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
