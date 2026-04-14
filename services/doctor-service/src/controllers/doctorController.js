const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Doctor service is running"
    });
};

module.exports = {
    getHealth
};