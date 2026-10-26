import Activity from "@/models/Activity";

export async function logActivity(data) {
  try {
    await Activity.create(data);
  } catch (error) {
    console.error("Activity log error:", error);
  }
}
