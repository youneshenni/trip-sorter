import validator from "./validator";

describe("validator", () => {
  it("should throw if data passed is invalid", () => {
    expect.assertions(1);
    expect(() => validator.parse(["a"])).toThrow();
  });
});
