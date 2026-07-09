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
const organizationController = {
    createOrganization,
    getOrganizations
}
export default organizationController