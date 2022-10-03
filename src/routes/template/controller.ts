import { Prisma } from ".prisma/client";
import { Request, Response } from "express";
import prisma from "~/lib/prisma";
import { schema } from "./schema";

export const handleCreateTemplate = async (req: Request, res: Response) => {
  const { error } = schema.validate(req.body);
  if (!error) {
    const { html, photo } = req.body;

    const newTemplateObject = {
      html,
      photo,
    };
    const template = await prisma.template.create({
      data: newTemplateObject,
    });
    return res.json({ data: template });
  }
  return res.status(500).json({ data: error.details[0].message });
};

export const handleDeleteTemplate = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const templateId = Number(req.params.id);
  if (!templateId) return res.status(400).json({ data: "Invalid ID" });

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });

  if (!template) return res.status(404).json({ data: "Template Not Found" });

  await prisma.template.delete({
    where: {
      id: templateId,
    },
  });

  return res.status(200).json({ data: "Successfully Deleted!" });
};

export const handleGetAllTemplates = async (req: Request, res: Response) => {
  const skip = Number(req.query.skip) || 0;
  const take = Number(req.query.take) || 10;

  const templates = await prisma.template.findMany({
    skip: skip,
    take: take,
  });

  return res.json({ data: templates });
};

export const handleGetTemplateById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const templateId = Number(req.params.id);
  if (isNaN(templateId)) return res.status(400).json({ data: "Invalid Id" });

  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });
  if (!template) return res.status(404).json({ data: "Template not found" });
  return res.json({ data: template });
};

export const handleUpdateTemplateById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  const templateId = Number(req.params.id);
  const allowedUpdateFields: Array<keyof Prisma.templateUpdateInput> = [
    "html",
    "photo",
  ];

  const updates = Object.keys(req.body);

  const updateObject: Prisma.templateUpdateInput = {};

  for (const update of updates) {
    if (
      !allowedUpdateFields.includes(update as keyof Prisma.templateUpdateInput)
    )
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

  const templateToBeUpdated = await prisma.template.findUnique({
    where: { id: templateId },
  });
  if (!templateToBeUpdated)
    return res.status(404).json({ data: "Template Not Found" });

  updateObject.updatedAt = new Date();
  const template = await prisma.template.update({
    where: {
      id: templateId,
    },
    data: updateObject,
  });

  return res.json({ data: template });
};
