import list from "./list";
import mockConsole from "jest-mock-console";

describe("test list", () => {
  beforeAll(() => {
    mockConsole();
  });

  it("should list workflows for list command", () => {
    const returnValue = list.checkAndRun({ command: "list" }, { a: 1, b: 2 });
    expect(returnValue).toBeTruthy();
  });

  it("should not list workflows for any other command", () => {
    const returnValue = list.checkAndRun({ command: "draw" }, {});
    expect(returnValue).toBeFalsy();
  });
});
