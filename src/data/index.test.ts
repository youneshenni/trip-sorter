import getData from ".";

describe("data", () => {
  it("should be valid", () => {
    expect.assertions(1);
    expect(getData).not.toThrow();
  });
});
