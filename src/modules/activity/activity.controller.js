import { asyncHandler } from "../../utils/asyncHandler.js";
import activityService from "./activity.service.js";

const getTaskActivity = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    const activities =
        await activityService.getTaskActivity({
            taskId,
            userId: req.user.id,
        });

    return res.status(200).json({
        success: true,
        message: "Activity fetched successfully",
        data: activities,
    });

});

const activityController = {
    getTaskActivity,
};

export default activityController;