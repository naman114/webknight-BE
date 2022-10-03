import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";

export const handleCreateCertificate = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { content, user } = req.body;

    const userToBeConnected = await prisma.user.findUnique({
      where: { id: user },
    });

    if (!userToBeConnected)
      return res.status(400).json({ data: "User not found" });

    const newCertificateObject = {
      content,
      user: { connect: { id: user } },
    };
    const certificate = await prisma.certificate.create({
      data: newCertificateObject,
    });
    return res.json({ data: certificate });
  }
  return res.status(500).json({ data: error.details[0].message });
};

export const handleDeleteCertificate = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const certificateId = Number(req.params.id);
  if (!certificateId) return res.status(400).json({ data: "Invalid ID" });

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
  });

  if (!certificate)
    return res.status(404).json({ data: "Certificate Not Found" });

  await prisma.certificate.delete({
    where: {
      id: certificateId,
    },
  });

  return res.status(200).json({ data: "Successfully Deleted!" });
};

export const handleGetAllCertificates = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const certificates = await prisma.certificate.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: certificates });
};

export const handleGetCertificateById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const certificateId = Number(req.params.id);
  if (isNaN(certificateId)) return res.status(400).json({ data: "Invalid Id" });

  const certificate = await prisma.certificate.findUnique({
    where: { id: certificateId },
  });
  if (!certificate)
    return res.status(404).json({ data: "Certificate not found" });
  return res.json({ data: certificate });
};

export const handleUpdateCertificateById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const certificateId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.certificateUpdateInput> = [
    "content",
    "user",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.certificateUpdateInput = {};

  for (const update of updates) {
    if (
      !allowedUpdateFields.includes(
        update as keyof Prisma.certificateUpdateInput
      )
    )
      return res.status(400).json({ data: "Invalid Arguments" });

    if (["user"].includes(update)) {
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

  const certificateToBeUpdated = await prisma.certificate.findUnique({
    where: { id: certificateId },
  });
  if (!certificateToBeUpdated)
    return res.status(404).json({ data: "Certificate Not Found" });

  updateObject.updatedAt = new Date();
  const certificate = await prisma.certificate.update({
    where: {
      id: certificateId,
    },
    data: updateObject,
  });

  return res.json({ data: certificate });
};
