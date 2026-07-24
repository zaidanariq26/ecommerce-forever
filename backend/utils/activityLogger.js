import activityLogModel from "../models/activityLogModel.js";

const logActivity = async (action, entity, entityId = null, details = "") => {
  try {
    await activityLogModel.create({
      action,
      entity,
      entityId,
      details,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

export default logActivity;
