# ccigraph

![Lint](https://github.com/lqueryvg/ccigraph/workflows/Lint/badge.svg)

Create CircleCI workflow diagrams from the CLI.

The diagrams can be viewed here: https://dreampuf.github.io/GraphvizOnline.

## Usage

This package is meant to be used as a command-line tool.

```
Usage:
  ccigraph [-f {filename}] list                      # list all workflow names
  ccigraph [-f {filename}] draw -w {workflow} [-p]   # draw a specific workflow
Options:
  -f {filename}   the circleci config file, default = .circleci/config.yml
  -w {workflow}   the workflow name to draw
  -p              print the raw graph text instead of creating a link
Long Names:
  -f        --file
  -w        --workflow
  -p        --print
```

## Example

Imagine you are in the root of your project and
you have a `.circleci/config.yml` which contains
two workflows. You can list them as follows:

```
$ ccigraph list
non_master_branch_build
build_test_deploy
```

Create a diagram of the `non_master_branch_build` workflow as follows:

```
$ ccigraph draw -w non_master_branch_build
https://dreampuf.github.io/GraphvizOnline/#digraph%20G%20%7B%0A%20%20non_master_branch_build%20-%3E%20build%3B%0A%20%20build%20-%3E%20lint%3B%0A%20%20lint%20-%3E%20test%3B%0A%7D
```

The output is a link to the diagram.

Tip: If you are using a terminal tool which supports URL links,
you can click the link to open a browser tab.

For example `Cmd`-`click` on the URL on Mac in iTerm2.

You should see something like this in a new browser tab:

![screenshot](./diagrams/Screenshot.png)

## Bugs / Caveats

If your CircleCI config file is invalid, don't be shocked if this tool fails.

Consider validating the CircleCI config first using the [CircleCI CLI](https://circleci.com/docs/2.0/local-cli/)

## Moan

It shouldn't be necessary to write tools such as this.
Why can't the CircleCI UI draw a decent diagram of your workflow ?
