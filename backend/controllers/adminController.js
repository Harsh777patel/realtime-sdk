import UserModel from "../models/UserModel.js";
import ApiKey from "../models/ApiKey.js";

export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalKeys = await ApiKey.countDocuments();
    const recentUsers = await UserModel.find({}, '-password').sort({ createdAt: -1 }).limit(5);
    
    // Mocking some infrastructure stats for demo
    const stats = {
      totalUsers,
      totalKeys,
      recentUsers,
      revenue: (totalUsers * 4.5).toFixed(2), // Just for demo
      throughput: "8.4M",
      deployments: totalKeys + 5
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.find({}).populate('userId', 'name email');
    res.status(200).json({ success: true, data: keys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
