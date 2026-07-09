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

const organizationController = {
    createOrganization
}
export default organizationController