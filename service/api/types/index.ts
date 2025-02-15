import { User, Todo as PrismaTodo } from "@prisma/client";

export type SafeUser = Omit<User, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type SafeTodo = Omit<PrismaTodo, "createdAt" | "updatedAt">;
