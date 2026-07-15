import { asyncHandler } from "../../utils/asyncHandler.js";
import notificationService from "./notification.service.js";

const getNotifications = asyncHandler(async (req, res) => {

    const notifications =
        await notificationService.getNotifications({
            userId: req.user.id,
        });

    return res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
    });

});

const markAsRead = asyncHandler(async (req, res) => {

    const { notificationId } = req.params;

    const notification =
        await notificationService.markAsRead({
            notificationId,
            userId: req.user.id,
        });

    return res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification,
    });

});

const markAllAsRead = asyncHandler(async (req, res) => {

    await notificationService.markAllAsRead({
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
    });

});

const notificationController = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};

export default notificationController;