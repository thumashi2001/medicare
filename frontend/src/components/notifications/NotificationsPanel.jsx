import { useState, useEffect, useCallback } from "react";
import {
  getUserNotifications,
  markNotificationRead,
  getPatientIdFromToken,
} from "../../services/appointmentApi";

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const NotificationIcon = ({ title }) => {
  if (title.toLowerCase().includes("confirmed")) return "✅";
  if (title.toLowerCase().includes("cancelled")) return "❌";
  if (title.toLowerCase().includes("pending")) return "⏳";
  return "🔔";
};

export default function NotificationsPanel() {
  const userId = getPatientIdFromToken();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getUserNotifications(userId);
      setNotifications(res.data?.data || []);
    } catch {
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {
      // silent fail — not critical
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-green-light p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={async () => {
              const unread = notifications.filter((n) => !n.read);
              await Promise.allSettled(unread.map((n) => markNotificationRead(n._id)));
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
            }}
            className="text-sm font-medium text-green-dark hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchNotifications}
            className="text-red-700 underline text-xs ml-4"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && notifications.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-gray-600 font-medium">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Activity from your appointments will appear here
          </p>
        </div>
      )}

      {/* Notification List */}
      {!loading && !error && notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`rounded-2xl p-4 shadow-sm transition-colors ${
                n.read ? "bg-white" : "bg-green-light border-l-4 border-green-primary"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
                    n.read ? "bg-gray-100" : "bg-white shadow-sm"
                  }`}
                >
                  <NotificationIcon title={n.title} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        n.read ? "text-gray-600" : "text-gray-800"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  {!n.read && (
                    <button
                      onClick={() => handleMarkRead(n._id)}
                      className="mt-2 text-xs text-green-dark font-medium hover:underline"
                    >
                      Mark as read
                    </button>
                  )}
                </div>

                {/* Unread indicator */}
                {!n.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-green-primary flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
