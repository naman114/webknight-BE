import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import config from "../../config";

export const handleLogin = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const username = req.body.username;
    if (username.length === 0)
      return res.status(400).json({ data: "Invalid Username" });

    const request = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!request) return res.status(404).json({ data: "User not found" });

    const match = await bcrypt.compare(req.body.password, request.password);
    if (match) {
      //login user
      const secret = config.JWT_SECRET;
      const payload = {
        username: request.username,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "24h" });
      res.status(200).json({
        token,
        message: "Credentials are correct!, user is logged in.",
      });
    } else {
      res.status(400).json({
        message:
          "User Credentials are invalid, Kindly redirect to login page again",
      });
    }
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  let token: string;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = config.JWT_SECRET;

      const decoded: any = jwt.verify(token, secret);

      const user = await prisma.user.findUnique({
        where: {
          username: decoded.username,
        },
      });

      if (user?.password) {
        user.password = "";
      }

      return res.status(200).json({ data: user });
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  return res.status(400).json({ data: "Invalid token" });
};
