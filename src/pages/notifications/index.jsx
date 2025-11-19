import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../../config/env";
import { UserContext } from "../../context/contexts";
import { useNotifications } from "../../context/notificationContext";
import { toast } from "react-hot-toast";
import {
  LucideBell,
  LucideTrash2,
  LucideClock,
  LucideUser,
  LucideInbox,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const Notifications = () => {
  const { authState } = useContext(UserContext);
  const { markAllAsRead, updateUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(6);

  const unreadTotal = useMemo(
    () => notifications.filter((notification) => !notification.viewed).length,
    [notifications]
  );

  const fetchNotifications = useCallback(async () => {
    if (!authState?.id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        *,
        institutes:institutes(name)
      `
      )
      .eq("receiver_id", authState.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Unable to load notifications");
      setLoading(false);
      return;
    }

    setNotifications(data || []);
    updateUnreadCount(
      data?.filter((notification) => !notification.viewed).length || 0
    );
    setLoading(false);
  }, [authState?.id, updateUnreadCount]);

  const handleDeleteNotification = async (notificationId) => {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Error deleting notification:", error);
      toast.error("Unable to delete notification");
      return;
    }

    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
    toast.success("Notification deleted");
  };

  const handleMarkAllAsRead = useCallback(async () => {
    if (!authState?.id) return;
    const { error } = await supabase
      .from("notifications")
      .update({ viewed: true })
      .eq("receiver_id", authState.id)
      .eq("viewed", false);

    if (error) {
      console.error("Error marking notifications as read:", error);
      toast.error("Unable to mark notifications as read");
      return;
    }

    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, viewed: true }))
    );
    markAllAsRead();
  }, [authState?.id, markAllAsRead]);

  useEffect(() => {
    if (!authState?.id) return;

    fetchNotifications();

    const channel = supabase
      .channel(`notifications_feed_${authState.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${authState.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${authState.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === payload.new.id
                ? { ...notification, ...payload.new }
                : notification
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `receiver_id=eq.${authState.id}`,
        },
        (payload) => {
          setNotifications((prev) =>
            prev.filter((notification) => notification.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authState?.id, fetchNotifications]);

  useEffect(() => {
    if (!authState?.id) return;
    if (!notifications.some((notification) => !notification.viewed)) return;

    const timer = setTimeout(() => {
      handleMarkAllAsRead();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notifications, authState?.id, handleMarkAllAsRead]);

  const visibleNotifications = notifications.slice(0, displayLimit);
  const hasMore = notifications.length > displayLimit;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-tight">
            Notification center
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Updates from your institute
          </h1>
          <p className="text-sm text-muted-foreground">
            {unreadTotal === 0
              ? "You're all caught up!"
              : `${unreadTotal} unread ${
                  unreadTotal === 1 ? "notification" : "notifications"
                }`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={unreadTotal === 0}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
          <Button
            variant="secondary"
            disabled={!hasMore}
            onClick={() => setDisplayLimit((prev) => prev + 4)}
          >
            Load more
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-24 animate-pulse rounded-2xl border bg-white/50"
            />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <LucideInbox className="h-5 w-5 text-muted-foreground" />
              Nothing new yet
            </CardTitle>
            <CardDescription>
              Your institute will send updates and announcements here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {visibleNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${
                notification.viewed
                  ? "border-l-transparent"
                  : "border-l-primary/80 bg-primary/5"
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LucideBell className="h-4 w-4 text-primary" />
                    <span>
                      {notification.institutes?.name || "Your institute"}
                    </span>
                    <span>•</span>
                    <LucideClock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <CardTitle className="pt-2 text-base font-semibold">
                    {notification.title || "Institute update"}
                  </CardTitle>
                  <CardDescription className="pt-2 text-foreground">
                    {notification.message}
                  </CardDescription>
                </div>
                {!notification.viewed && (
                  <Badge variant="default" className="self-start">
                    New
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <LucideUser className="h-4 w-4" />
                  <span>{notification.source || "Staff"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    <LucideTrash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setDisplayLimit((prev) => prev + 4)}>
            Show older updates
          </Button>
        </div>
      )}
    </section>
  );
};

export default Notifications;
