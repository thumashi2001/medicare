const axios = require("axios");

exports.getUsers = async (req, res) => {
    try {
        const response = await axios.get(
            "http://localhost:5001/api/auth/users",
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("ADMIN ERROR:", error.message);
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

//delete user
exports.deleteUser = async (req, res) => {
    try {
        const response = await axios.delete(
            `http://localhost:5001/api/auth/users/${req.params.id}`,
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

//verify doctor
exports.verifyDoctor = async (req, res) => {
    try {
        const response = await axios.put(
            `http://localhost:5001/api/auth/verify-doctor/${req.params.id}`,
            {},
            {
                headers: {
                    Authorization: req.headers.authorization
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to verify doctor" });
    }
};

exports.getStats = async (req, res) => {
  try {
    res.json({
      totalUsers: 1254,
      pendingDoctors: 18,
      transactions: "Rs. 245,680.00",
      activeAppointments: 156
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    res.json([
      {
        title: "New user registered",
        description: "saman@gmail.com • 2 minutes ago"
      },
      {
        title: "Doctor verification submitted",
        description: "Dr. Nuwan Perera • 15 minutes ago"
      },
      {
        title: "Payment received",
        description: "Rs. 3500.00 • 1 hour ago"
      }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const search = req.query.q?.toLowerCase() || "";

    const response = await axios.get("http://localhost:5001/api/auth/users", {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    const filteredUsers = response.data.filter((user) =>
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );

    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: "Failed to search users" });
  }
};

exports.getPendingDoctors = async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/auth/doctors/pending",
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending doctors" });
  }
};

exports.getVerifiedDoctors = async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:5001/api/auth/doctors/verified",
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch verified doctors" });
  }
};

exports.rejectDoctor = async (req, res) => {
  try {
    const response = await axios.put(
      `http://localhost:5001/api/auth/reject-doctor/${req.params.id}`,
      {},
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject doctor" });
  }
};