import jwt from "jsonwebtoken"

export interface TokenPayload {
  discordId: string;
  userName: string;
  avatar: string;
  role: "User"|"Admin"|"Regular"|"SuperAdmin";
}

export const createAccessToken = (payload: TokenPayload): Promise<string> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  ); // Input: payload, Output: Promise which resolves into the token

export const verifyAccessToken = (token: string): Promise<TokenPayload> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) reject(err);
      else resolve(payload as TokenPayload);
    })
  );