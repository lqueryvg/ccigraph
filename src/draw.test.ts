import YAML from "yaml";
import dedent from "dedent";
import mockConsole from "jest-mock-console";
import draw from "./draw";

describe("draw tests", () => {
  const SIMPLE_GOOD_WORKFLOW = dedent(`
      jobs:
        - build
        - {lint: { requires: [build] } }
        - {test: { requires: [lint], type: approval } }
  `);
  const TEST_WORKFLOW_NAME = "TestWorkflow";

  beforeEach(() => {
    mockConsole();
  });

  it("creates a diagram link from a workflow in a file", () => {
    const workflows = YAML.parse(SIMPLE_GOOD_WORKFLOW);

    draw(TEST_WORKFLOW_NAME, false, workflows.jobs);
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      "https://dreampuf.github.io/GraphvizOnline/#digraph%20TestWorkflow%20%7B%0A%20%20TestWorkflow%20%5B%0A%20%20%20%20style%3D%22filled%22%0A%20%20%20%20fillcolor%3D%22%2342c88a%22%0A%20%20%5D%0A%20%20TestWorkflow%20-%3E%20%22build%22%3B%0A%20%20%22build%22%20-%3E%20%22lint%22%3B%0A%20%20%22lint%22%20-%3E%20%22test%22%3B%0A%20%20%22test%22%20%5B%20style%3D%22filled%22%20fillcolor%3D%22%23d8c4ea%22%20%5D%3B%0A%7D"
    );
  });

  it("creates raw digraph output", () => {
    const workflows = YAML.parse(SIMPLE_GOOD_WORKFLOW);

    draw(TEST_WORKFLOW_NAME, true, workflows.jobs);
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      dedent(
        `digraph ${TEST_WORKFLOW_NAME} {
          ${TEST_WORKFLOW_NAME} [
            style="filled"
            fillcolor="#42c88a"
          ]
          ${TEST_WORKFLOW_NAME} -> "build";
          "build" -> "lint";
          "lint" -> "test";
          "test" [ style="filled" fillcolor="#d8c4ea" ];
        }`
      )
    );
  });

  it("throws an error with unknown requires job", () => {
    const workflows = YAML.parse(
      dedent(`
          jobs:
            - {test: { requires: [does_not_exist] } }
      `)
    );

    expect.assertions(1);
    try {
      draw(TEST_WORKFLOW_NAME, false, workflows.jobs);
    } catch (e) {
      expect(e.message).toBe(
        "Error: Job 'test' requires 'does_not_exist', which is the name of 0 other jobs in workflow"
      );
    }
  });

  it("renames duplicate jobs", () => {
    const workflows = YAML.parse(
      dedent(`
          jobs:
            - build
            - build:
                name: build
      `)
    );

    draw(TEST_WORKFLOW_NAME, true, workflows.jobs);
    expect(console.log as jest.Mock).toHaveBeenCalledWith(
      dedent(
        `digraph ${TEST_WORKFLOW_NAME} {
          ${TEST_WORKFLOW_NAME} [
            style="filled"
            fillcolor="#42c88a"
          ]
          ${TEST_WORKFLOW_NAME} -> "build-1";
          ${TEST_WORKFLOW_NAME} -> "build-2";
        }`
      )
    );
  });
});
