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
const login = asyncHandler(async (req, res) => {
    const {
        user,
        accessToken,
        refreshToken,
    } = await authService.loginUser(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            user,
            accessToken,
        },
    });
});
const authController = {
    register,
    login
}
export default authController;