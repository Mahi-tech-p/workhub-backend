import { asyncHandler } from "../../utils/asyncHandler.js";
import { organisationService } from "./organization.service.js";


const createOrganization = asyncHandler(async (req, res) => {

    const { name } = req.body

    const organization = await organisationService.createOrganization({ name, userId: req.user.id })

    return res.status(201).json({
        success: true,
        message: "Organization created successfully",
        data: organization,
    })
})
const getOrganizations = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const result = await organisationService.getOrganizationByUserId(userId)
    return res.status(200).json({
        success: true,
        message: "Organisation fetched Successfully",
        data: result
    })
})
const addOrganizationMember = asyncHandler(async (req, res) => {
    const { organizationId } = req.params;
    const { userId, role } = req.body;

    const member =
        await organisationService.addOrganizationMember({
            organizationId,
            userId,
            role,
            currentUserId: req.user.id,
        });

    return res.status(201).json({
        success: true,
        message: "Organization member added successfully",
        data: member,
    });
});
const getOrganizationMembers = asyncHandler(async (req, res) => {

    const { organizationId } = req.params;

    const members =
        await organizationService.getOrganizationMembers({
            organizationId,
            userId: req.user.id,
        });

    return res.status(200).json({
        success: true,
        message: "Organization members fetched successfully",
        data: members,
    });
});
const removeOrganizationMember = asyncHandler(async (req, res) => {

    const { organizationId, memberId } = req.params;

    await organizationService.removeOrganizationMember({
        organizationId,
        memberId,
        userId: req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "Organization member removed successfully",
    });
});
const organizationController = {
    createOrganization,
    getOrganizations,
    addOrganizationMember,
    getOrganizationMembers,
    removeOrganizationMember

}
export default organizationController