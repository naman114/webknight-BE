import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";
import * as bcrypt from "bcrypt";

export const handleCreateUser = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { username, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const newUserObject = {
      username,
      password: hashPassword,
    };
    const user = await prisma.user.create({
      data: newUserObject,
    });
    return res.json({ data: user });
  }
  return res.status(500).json({ data: error.details[0].message });
};

export const handleDeleteUser = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  if (!userId) return res.status(400).json({ data: "Invalid ID" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return res.status(404).json({ data: "User Not Found" });

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return res.status(200).json({ data: "Successfully Deleted!" });
};

export const handleGetAllUsers = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const users = await prisma.user.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: users });
};

export const handleGetUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ data: "Invalid Id" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) return res.status(404).json({ data: "User not found" });
  return res.json({ data: user });
};

export const handleUpdateUserById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.userUpdateInput> = [
    "username",
    "password",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.userUpdateInput = {};

  for (const update of updates) {
    if (!allowedUpdateFields.includes(update as keyof Prisma.userUpdateInput))
      return res.status(400).json({ data: "Invalid Arguments" });

    if ([""].includes(update)) {
      const entityConnection = {
        connect: { id: req.body[update] },
      };
      const elem = await prisma[update].findUnique({
        where: { id: req.body[update] },
      });
      if (!elem) return res.status(400).json({ data: `${update} not found` });
      updateObject[update] = entityConnection;
    } else updateObject[update] = req.body[update];
  }

  const userToBeUpdated = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userToBeUpdated) return res.status(404).json({ data: "User Not Found" });

  updateObject.updatedAt = new Date();
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateObject,
  });

  return res.json({ data: user });
};

// Get certificates by user id

export const handleGetCertificatesByUserId = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const userId = Number(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ data: "Invalid Id" });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      certificate: true,
    },
  });
  if (!user) return res.status(404).json({ data: "User not found" });
  return res.json({ data: user });
};
