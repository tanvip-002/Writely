import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/user.repository";
import { setSessionCookie, clearSessionCookie } from "@/lib/auth/session";
import { SessionUser } from "@/types";

export class AuthService {
  static async register(data: {
    username: string;
    email: string;
    password: string;
    displayName: string;
  }): Promise<SessionUser> {
    const existingEmail = await UserRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("An account with this email already exists.");
    }

    const existingUsername = await UserRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new Error("This username is already taken. Please choose another.");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await UserRepository.create({
      username: data.username,
      email: data.email,
      passwordHash,
      displayName: data.displayName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.username)}`,
    });

    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    };

    await setSessionCookie(sessionUser);
    return sessionUser;
  }

  static async login(data: {
    emailOrUsername: string;
    password: string;
  }): Promise<SessionUser> {
    const user = await UserRepository.findByEmailOrUsername(data.emailOrUsername);
    if (!user) {
      throw new Error("Invalid username/email or password.");
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid username/email or password.");
    }

    const sessionUser: SessionUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    };

    await setSessionCookie(sessionUser);
    return sessionUser;
  }

  static async logout(): Promise<void> {
    await clearSessionCookie();
  }

  static async changePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<void> {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPass, user.passwordHash);
    if (!isMatch) throw new Error("Current password is incorrect");

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPass, salt);
    await UserRepository.updatePassword(userId, newHash);
  }
}
