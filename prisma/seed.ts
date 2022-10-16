import {
  Prisma,
  PrismaClient,
  user,
  template,
  certificate,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const getRandomListElement = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

const newTemplate = (): Prisma.templateCreateInput => {
  return {
    html: "Hello World",
    photo: faker.image.avatar(),
  };
};

const newUser = (): Prisma.userCreateInput => {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
  };
};

const newCertificate = (user: user): Prisma.certificateCreateInput => {
  return {
    content: faker.lorem.paragraph(),
    user: { connect: { id: user.id } },
  };
};

const prisma = new PrismaClient();

export const seed = async () => {
  const ROWS = 10;

  const templates: Array<template> = [];
  const users: Array<user> = [];
  const certificates: Array<certificate> = [];

  Array.from({ length: ROWS }).forEach(async () => {
    const template = await prisma.template.create({ data: newTemplate() });
    templates.push(template);

    const user = await prisma.user.create({ data: newUser() });
    users.push(user);

    const certificate = await prisma.certificate.create({
      data: newCertificate(getRandomListElement(users)),
    });
    certificates.push(certificate);
  });

  await prisma.$disconnect();
};
seed();
export default seed;
