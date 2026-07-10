// controllers/locationController.js
exports.getCities = async (req, res) => {
    const cities = ['Hyderabad', 'Bengaluru', 'Chennai', 'Pune', 'Delhi NCR', 'Mumbai'];
    res.status(200).json({ cities });
};
