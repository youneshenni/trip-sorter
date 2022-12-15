import { Command } from "@oclif/core";
import inquirer from "inquirer";
import { cardValidator } from "../data/validator";
import { type ZodError, type z } from "zod";
import Cards from "../classes/card";
import { Card } from "../classes/card";
import getData from "../data";
import { writeFileSync } from "fs";

export default class AddCard extends Command {
  static description = "Add a new card";
  async run() {
    this.log("Add a new card");
    const data = await inquirer.prompt<z.infer<typeof cardValidator>>([
      {
        type: "input",
        name: "end",
        message: "End destination",
        validate: (input: any) => Boolean(input),
      },
      {
        type: "input",
        name: "type",
        message: "Means of transport",
        validate: (input: any) => Boolean(input),
      },
      {
        type: "input",
        name: "reference",
        message: "Reference number",
      },
      {
        type: "input",
        name: "gate",
        message: "Gate number",
      },
      {
        type: "input",
        name: "seat",
        message: "Seat number",
      },
      {
        type: "input",
        name: "baggage",
        message:
          "Baggage drop number (type auto if it's automatically transferred)",
      },
    ]);
    const cards = Cards.getInstance(getData());
    data.start = cards.sortCards().slice(-1)[0]?.card.end as unknown as string;
    try {
      cardValidator.parse(data);
    } catch (e: unknown) {
      (e as ZodError).errors.forEach((error) =>
        this.error(error.path.join("/") + " " + error.message)
      );
    }

    cards.addCard(new Card(data));
    writeFileSync("../../data.json", cards.toJSON());
    this.log("Card added");
  }
}
