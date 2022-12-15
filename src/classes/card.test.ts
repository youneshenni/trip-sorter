import Cards, { type Card } from "./card";
import data from "../../data.json";
import getData from "../data";

const testData = [
  { start: "Oran", end: "Algiers", type: "airplane" },
  {
    start: "Constantine",
    end: "Annaba",
    type: "train",
  },
  { start: "Algiers", end: "Constantine", type: "taxi" },
];

beforeEach(() => {
  Cards.deleteInstance();
});

describe("cards", () => {
  it("should be a singleton class", () => {
    expect.assertions(1);
    const class1 = Cards.getInstance(getData());
    const class2 = Cards.getInstance(getData());

    expect(class1).toBe(class2);
  });

  it("should have a list of cards", () => {
    expect.assertions(1);
    const { cards } = Cards.getInstance(getData());

    expect(cards).not.toBeUndefined();
  });

  describe("toJSON", () => {
    it("should return a string", () => {
      expect.assertions(1);
      const cards = Cards.getInstance(getData());
      expect(typeof cards.toJSON()).toBe("string");
    });

    it("should return a stringified version of the cards", () => {
      expect.assertions(1);
      const cards = Cards.getInstance(getData());
      expect(JSON.parse(cards.toJSON())).toStrictEqual(data);
    });
  });

  describe("getGlobals", () => {
    it("gets the globals of our list", () => {
      expect.assertions(2);
      const cards = Cards.getInstance(testData);

      const { globalStart, globalEnd } = cards.getGlobals();
      expect(globalStart).toBe("Oran");
      expect(globalEnd).toBe("Annaba");
    });
  });

  describe("sortCards", () => {
    it("should sort the cards properly", () => {
      expect.assertions(1);
      const cards = Cards.getInstance(testData);

      const sortedCards = cards.sortCards();

      expect(sortedCards).toStrictEqual([
        cards.cards[0],
        cards.cards[2],
        cards.cards[1],
      ]);
    });
  });
});

describe("card", () => {
  it("should have a card", () => {
    expect.assertions(1);
    const { cards } = Cards.getInstance(getData());
    const card = cards[0];
    expect(card.card).not.toBeUndefined();
  });

  describe("setCard", () => {
    it("should reject an invalid card", () => {
      expect.assertions(1);
      const { cards } = Cards.getInstance(getData());
      const card = cards[0];
      expect(() => {
        card.setCard({} as unknown as Card["card"]);
      }).toThrow();
    });
  });
  describe("toString", () => {
    it("should return a string", () => {
      expect.assertions(1);
      const { cards } = Cards.getInstance(getData());
      const card = cards[0];
      expect(typeof card.toString()).toBe("string");
    });

    /**
     * TODO: This test should be using test data instead of data from the JSON file, so it doesnt break in case the JSON file is changed
     */
    it("should return a string with the correct format", () => {
      expect.assertions(4);
      const { cards } = Cards.getInstance(getData());
      expect(cards[0].toString()).toBe(
        "From Madrid, take train 78A to Barcelona. Sit on seat 45B."
      );
      expect(cards[1].toString()).toBe(
        "From Stockholm, take flight SK22 to New York JFK. Gate 22, Sit on seat 7B. Baggage will be automatically transferred from your last leg."
      );
      expect(cards[2].toString()).toBe(
        "From Gerona Airport, take flight SK455 to Stockholm. Gate 45B, Sit on seat 3A. Baggage will drop at ticket counter 334."
      );
      expect(cards[3].toString()).toBe(
        "From Barcelona, take airport bus to Gerona Airport."
      );
    });
  });
});
