import React, { useState, useEffect } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '' });
  const [editUser, setEditUser] = useState({ id: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost/fran/api/users.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost/fran/api/users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('User added successfully');
        setNewUser({ email: '', password: '' });
        fetchUsers(); // Refresh the user list
        setShowAddPopup(false);
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async () => {
    try {
      const response = await fetch('http://localhost/fran/api/users.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editUser),
      });

      if (response.ok) {
        alert('User updated successfully');
        setEditUser({ id: '', email: '' });
        setShowEditPopup(false);
        fetchUsers(); // Refresh the user list
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch('http://localhost/fran/api/users.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert('User deleted successfully');
        fetchUsers(); // Refresh the user list
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>
      <button onClick={() => setShowAddPopup(true)} style={styles.addButton}>
        Add User
      </button>
      <ul style={styles.list}>
        {users.map((user) => (
          <li key={user.id} style={styles.listItem}>
            <span>
              <strong>{user.email}</strong>
            </span>
            <button
              onClick={() => {
                setEditUser({ id: user.id, email: user.email });
                setShowEditPopup(true);
              }}
              style={styles.button}
            >
              Edit
            </button>
            <button onClick={() => handleDeleteUser(user.id)} style={styles.button}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Add User Popup */}
      {showAddPopup && (
        <div style={styles.popup}>
          <h2>Add User</h2>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleAddUser} style={styles.button}>
            Add
          </button>
          <button onClick={() => setShowAddPopup(false)} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}

      {/* Edit User Popup */}
      {showEditPopup && (
        <div style={styles.popup}>
          <h2>Edit User</h2>
          <input
            type="email"
            placeholder="Email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            style={styles.input}
          />
          <button onClick={handleEditUser} style={styles.button}>
            Save
          </button>
          <button onClick={() => setShowEditPopup(false)} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#ffffff', // White background
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#000000', // Black text
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: '#000000', // Black button
    color: '#ffffff', // White text
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    width: '100%',
    maxWidth: '400px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    marginBottom: '10px',
    backgroundColor: '#f9f9f9', // Light gray background
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  popup: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff', // White background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '100%',
    maxWidth: '300px',
  },
  button: {
    backgroundColor: '#000000', // Black button
    color: '#ffffff', // White text
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#cccccc', // Light gray button
    color: '#000000', // Black text
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
  },
};

export default UserManagement;