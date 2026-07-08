import { asyncHandler } from "../../utils/asyncHandler.js";
import authService from "./auth.service.js";


const register = asyncHandler(async (req, res) => {

    const newUser = await authService.registerUser(req.body);
    res.status(201)
        .json({
            success: true,
            message: "User registered successfully",
            data: newUser,
        });

})
const authController = {
    register
}
export default authController;