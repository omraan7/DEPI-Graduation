const NAV_ITEMS = [
  { id: "home",          icon: "🏠", label: "الرئيسية" },
  { id: "profile",       icon: "👤", label: "بروفايلي" },
  { id: "messages",      icon: "💬", label: "رسائل" },
  { id: "notifications", icon: "🔔", label: "إشعارات" },
];

export default function Navbar({ page, setPage, userType, unreadCount = 0 }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
      background: "#fff", borderTop: "1px solid #f1f5f9",
      display: "flex", alignItems: "stretch",
      fontFamily: "'Cairo',sans-serif", direction: "rtl",
      boxShadow: "0 -4px 20px rgba(0,0,0,.06)",
    }}>
      {NAV_ITEMS.map(item => {
        const active = page === item.id;
        const showBadge = item.id === "messages" && unreadCount > 0;
        return (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            flex: 1, padding: "10px 0 8px", border: "none",
            background: "transparent", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: active ? "#1e293b" : "#94a3b8",
            borderTop: `2px solid ${active ? "#1e293b" : "transparent"}`,
            transition: "all .15s", position: "relative",
          }}>
            <span style={{ fontSize: 20, lineHeight: 1, position: "relative" }}>
              {item.icon}
              {showBadge && (
                <span style={{
                  position: "absolute", top: -4, right: -6,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#ef4444", color: "#fff",
                  fontSize: 9, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{unreadCount}</span>
              )}
            </span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 400 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
