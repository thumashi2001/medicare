export default function AdminHeader() {
  const name = localStorage.getItem("name") || "Admin User";

  return (
    <header className="admin-header">
      <div>
        <h3>{name}</h3>
        <span>Administrator</span>
      </div>

      <div className="admin-avatar">
        {name.charAt(0).toUpperCase()}
      </div>
    </header>
  );
}