import { db } from "../../db/index.js";

import { notificationRepository } from "./notification.repository.js";

import {
    NotFoundError,
    ForbiddenError,
} from "../../errors/index.js";

const createNotification = async (database , {
    userId,
    type,
    title,
    message,
    entityType = null,
    entityId = null,
}) => {

    return await notificationRepository.create(database, {
        userId,
        type,
        title,
        message,
        entityType,
        entityId,
    });

};

const getNotifications = async ({
    userId,
}) => {

    return await notificationRepository.findByUserId(
        db,
        userId
    );

};

const markAsRead = async ({
    notificationId,
    userId,
}) => {

    const notification =
        await notificationRepository.findById(
            db,
            notificationId
        );

    if (!notification) {
        throw new NotFoundError(
            "Notification not found",
            "NOTIFICATION_NOT_FOUND"
        );
    }

    if (notification.userId !== userId) {
        throw new ForbiddenError(
            "Access denied",
            "NOTIFICATION_ACCESS_DENIED"
        );
    }

    return await notificationRepository.markAsRead(
        db,
        notificationId
    );

};

const markAllAsRead = async ({
    userId,
}) => {

    await notificationRepository.markAllAsRead(
        db,
        userId
    );

};

const notificationService = {
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
};

export default notificationService;