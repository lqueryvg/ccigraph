# ccigraph

![Lint](https://github.com/lqueryvg/ccigraph/workflows/Lint/badge.svg)

`ccigraph` is a CLI tool to help creates graph (think "diagrams") of your CircleCI workflows.

Suitable for viewing in https://dreampuf.github.io/GraphvizOnline.

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

First, list the workflow names in your CircleCI config file:

```
$ ccigraph list
non_master_branch_build
build_test_deploy
```

Next, create a link to the graph:

```
$ ccigraph draw -w build_test_deploy
https://dreampuf.github.io/GraphvizOnline/#digraph%20G%20%7B%0A%20%20non_master_branch_build%20-%3E%20build%3B%0A%20%20build%20-%3E%20lint%3B%0A%20%20lint%20-%3E%20test%3B%0A%7D
```

If you are using a terminal tool which supports URL links,
you can click the link to open a browser tab.

For example `Cmd` click on the URL on Mac in iTerm2.

You should see something like this in a new browser tab:

![screenshot](./diagrams/Screenshot.png)

## Bugs / Caveats

If your CircleCI config file is invalid, don't expect great results from this tool.

Consider validating the CircleCI config first using the [CircleCI CLI](https://circleci.com/docs/2.0/local-cli/)

## Moan

It shouldn't be necessary to write tools such as this.
Why can't the CircleCI UI draw a decent diagram of your workflow ?
