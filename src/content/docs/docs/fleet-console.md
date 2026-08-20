---
title: Fleet console
description: The browser-based console for seeing and controlling every agent and machine in a Kyber cluster.
---

The fleet console is a web app (a PWA) served by your Kyber cluster itself. It is where you create agents, watch what they are doing, read their logs, and act when something needs attention.

## One console, five surfaces

The console is organized into surfaces, each for one job:

- **Fleet**: an overview of all machines and agents in the cluster at once.
- **Machines**: create and manage the machines agents run on, and reach a machine's terminal.
- **Agents**: create and manage agents, stream logs, and drive lifecycle actions such as stop, start, suspend, restart, re-authorize, and delete.
- **Metrics**: per-agent token usage, cost, and activity.
- **Settings**: set the API key and see the full cluster version breakdown.

Every screen shows a cluster identifier with the cluster's name and version, so you can confirm which cluster and which build you are about to act on. If a newer version deploys while your tab is open, a refresh indicator appears next to the version.

## Agent status and activity

Each agent in the Agents list shows a status dot plus a short activity signal: "Working" while the agent is mid-turn, or "Idle" with a relative time once it is waiting for input. The agent detail view adds an Activity tab: a structured record of the last 7 days of conversations, tool calls, and delegated subagent work, with an export to plain text.

Logs come from two sources. **Live** tails the current pod's output as it happens. **Archive** is a durable, off-cluster copy: pick a time window and read what the agent logged even across restarts, back to a retention window that defaults to 30 days.

## Honest metrics

The Metrics surface shows fleet counts, per-agent working time, token usage, cost, and live node CPU, memory, and disk gauges. It follows one rule: never show a confident number Kyber cannot stand behind. A model with no known price shows "unpriced" rather than a believable $0.00, and a context-window budget that cannot be confirmed is marked as an estimate.

## Learn more

- [Operator surfaces: the PWA and Holocron](https://github.com/matty-v/kyber/blob/main/docs/product/pwa-holocron.md)
- [Metrics tab](https://github.com/matty-v/kyber/blob/main/docs/metrics-tab.md)
