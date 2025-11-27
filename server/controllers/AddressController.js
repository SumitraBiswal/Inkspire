import Address from "../models/addressmodel.js"


// Add a new address
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName, phone, house, city, state, pincode, landmark } = req.body;

    const newAddress = new Address({
      userId,
      fullName,
      phone,
      house,
      city,
      state,
      pincode,
      landmark,
    });

    await newAddress.save();

    res.json({ success: true, address: newAddress, message: "Address added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all addresses of the user
export const getAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    const addresses = await Address.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.json({ success: false, message: "Address not found" });

    res.json({ success: true, address: updated, message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const deleted = await Address.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.json({ success: false, message: "Address not found" });

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};