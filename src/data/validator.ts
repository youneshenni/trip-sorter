import { z } from "zod";

const validator = z.array(
  z.object({
    start: z.string(),
    end: z.string(),
    type: z.string(),
    reference: z.string().optional(),
    gate: z.string().optional(),
    seat: z.string().optional(),
    baggage: z.string().optional(),
  })
);

export default validator;
