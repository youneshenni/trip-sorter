import { Command } from "@oclif/core";
import getData from "../data";
import Cards from "../classes/card";

export default class GetCards extends Command {
  static description = "Get the list of cards";

  async run() {
    const cards = Cards.getInstance(getData());

    const verbs = cards.getVerbs();

    this.log(verbs.join("\n"));
  }
}
