import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
    default: null,
  },
  details: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Number,
    required: true,
    default: Date.now,
  },
});

const activityLogModel =
  mongoose.models.activityLog ||
  mongoose.model("activityLog", activityLogSchema);

export default activityLogModel;
