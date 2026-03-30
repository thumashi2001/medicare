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
    const doctorId = req.params.id;

    res.json({ message: `Doctor ${doctorId} verified` });
};