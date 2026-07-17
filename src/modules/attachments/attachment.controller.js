import {asyncHandler} from "../../utils/asyncHandler.js";

import attachmentService from "./attachment.service.js";
const uploadAttachment = asyncHandler(
    async (req, res) => {

        const { taskId } = req.params;

        const attachment =
            await attachmentService.uploadAttachment({
                taskId,
                file: req.file,
                userId: req.user.id,
            });

        return res.status(201).json({
            success: true,
            message:
                "Attachment uploaded successfully",
            data: attachment,
        });
    }
);

const getTaskAttachments = asyncHandler(
    async (req, res) => {

        const { taskId } = req.params;

        const attachments =
            await attachmentService.getTaskAttachments({
                taskId,
                userId: req.user.id,
            });

        return res.status(200).json({
            success: true,
            message:
                "Attachments fetched successfully",
            data: attachments,
        });
    }
);
const deleteAttachment = asyncHandler(
    async (req, res) => {

        const { attachmentId } = req.params;

        await attachmentService.deleteAttachment({
            attachmentId,
            userId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message:
                "Attachment deleted successfully",
        });
    }
);
const attachmentController = {
    uploadAttachment,
    getTaskAttachments,
    deleteAttachment,
};

export default attachmentController;