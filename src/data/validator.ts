import { z } from "zod";

export const cardValidator = z.object({
  start: z.string(),
  end: z.string(),
  type: z.string(),
  reference: z.string().optional(),
  gate: z.string().optional(),
  seat: z.string().optional(),
  baggage: z.string().optional(),
});

const validator = z.array(cardValidator);

export default validator;
