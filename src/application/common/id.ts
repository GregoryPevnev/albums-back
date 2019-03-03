import uuid from "uuid";

type Id = string;

export const generateId = (): Id => String(uuid());

export default Id;
