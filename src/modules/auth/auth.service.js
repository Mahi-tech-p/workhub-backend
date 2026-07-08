import { de } from "zod/locales";
import { authRepository } from "./auth.repository.js"
import bcrypt from "bcrypt";
import ConflictError from "../../errors/ConflictError.js";

const registerUser = async ({ firstName, lastName, email, password }) => {
    
    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
        throw new ConflictError("User with this email already exists", "USER_ALREADY_EXISTS");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await authRepository.createUser({
        firstName,
        lastName,
        email,
        passwordHash: passwordHash
    })
    return newUser;
}
const authService = {
    registerUser
}
export default authService;