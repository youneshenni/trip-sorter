import { Command } from "@oclif/core";
import Cards, { Card } from "../classes/card";
import getData from "../data";

export default class GetSorted extends Command {
  static description = "Get the sorted list of cards";

  async run() {
    const cards = Cards.getInstance(getData()).sortCards();
    const verbs = cards.map((card) => card?.toString());
    this.log(
      verbs.join("\n").concat("\nYou have arrived at your final destination.")
    );
  }
}
