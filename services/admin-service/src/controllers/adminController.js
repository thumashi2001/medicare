exports.getUsers = async (req, res) => {
    res.json({
        message: "List of users (mock data)",
        users: [
            { id: 1, name: "User1" },
            { id: 2, name: "User2" }
        ]
    });
};

//delete user
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    res.json({ message: `User ${userId} deleted (mock)` });
};

//verify doctor
exports.verifyDoctor = async (req, res) => {
    const doctorId = req.params.id;

    res.json({ message: `Doctor ${doctorId} verified` });
};