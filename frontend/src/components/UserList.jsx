const UserList = ({ users, typingUsers }) => {
  return (
    <aside className="user-list">
      <h3>Online ({users.length})</h3>
      <ul>
        {users.map((u) => (
          <li key={u}>
            <span className="dot" />
            {u}
            {typingUsers.includes(u) && <em> typing...</em>}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserList;