import type validator from "../data/validator";
import { cardValidator } from "../data/validator";
import { type z } from "zod";
import { writeFileSync } from "fs";
import { join } from "path";

export default class Cards {
  static instance: Cards | undefined;

  static getInstance(data: z.infer<typeof validator> | undefined = undefined) {
    if (!Cards.instance) {
      if (!data) throw new Error("Data is required");
      Cards.instance = new Cards(data as unknown as z.infer<typeof validator>);
    }

    return Cards.instance;
  }

  static deleteInstance() {
    delete Cards.instance;
  }

  cards: Card[];
  private constructor(data: z.infer<typeof validator>) {
    this.cards = data.map((card) => new Card(card));
  }

  addCard(card: Card) {
    this.cards.push(card);
    const newCards = this.toJSON();
    // Write to data.json file
    writeFileSync(join(__dirname, "../../data.json"), newCards);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  toJSON() {
    return JSON.stringify(this.cards.map(({ card }) => card));
  }

  /**
   * Calculates the global start and end points of the journey
   */
  getGlobals() {
    const { cards } = this;
    const starts = cards.map(({ card: { start } }) => start);
    const ends = cards.map(({ card: { end } }) => end);
    const repetitions = [...starts, ...ends].reduce<Record<string, number>>(
      (acc, cur) => ({
        ...acc,
        [cur]: Object.keys(acc).includes(cur) ? 2 : 1,
      }),
      {}
    );
    const singles = Object.keys(repetitions).filter(
      (key) => repetitions[key] === 1
    );
    const globalStart = starts.find((destination) =>
      singles.includes(destination)
    );
    const globalEnd = ends.find((destination) => singles.includes(destination));
    return { globalStart, globalEnd };
  }

  /**
   * Sorts all cards
   */
  sortCards() {
    const { cards } = this;
    // Gets global start and end
    const { globalStart, globalEnd } = this.getGlobals();
    // Joins destinations one by one
    const sortedCards = [
      cards.find(({ card: { start } }) => start === globalStart),
    ];

    let tempIter = 0;
    while (sortedCards.slice(-1)[0]?.card.end !== globalEnd && tempIter < 10) {
      sortedCards.push(
        cards.find(
          ({ card: { start } }) => sortedCards.slice(-1)[0]?.card.end === start
        )
      );
      tempIter++;
    }

    // Cast: The previous loop cannot give an undefined value
    return sortedCards;
  }

  getVerbs() {
    return this.cards.map((card) => card.toString());
  }
}

export class Card {
  static precedeWithSpaceIfUndefined(
    value: string | undefined,
    prefix: string | undefined = "",
    suffix: string | undefined = ""
  ) {
    return value ? (prefix ? " " + prefix : "") + " " + value + suffix : "";
  }

  constructor(public card: z.infer<typeof cardValidator>) {
    this.card = card;
  }

  toString() {
    const { type, reference, gate, seat, baggage, start, end } = this.card;
    return `From ${start}, take ${type}${Card.precedeWithSpaceIfUndefined(
      reference
    )} to ${end}.${Card.precedeWithSpaceIfUndefined(
      gate,
      "Gate",
      ","
    )}${Card.precedeWithSpaceIfUndefined(seat, "Sit on seat", ".")}${
      baggage === "auto"
        ? " Baggage will be automatically transferred from your last leg."
        : Card.precedeWithSpaceIfUndefined(
            baggage,
            "Baggage will drop at ticket counter",
            "."
          )
    }`;
  }

  setCard(card: z.infer<typeof cardValidator>) {
    cardValidator.parse(card);
    this.card = card;
  }
}
