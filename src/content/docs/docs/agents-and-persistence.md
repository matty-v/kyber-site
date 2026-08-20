---
title: Agents and persistence
description: How Kyber keeps long-lived agents alive, and what survives restarts, upgrades, and machine preemption.
---

A Kyber agent is a long-lived worker with its own persistent filesystem, its own identity, and its own model. You declare what you want and Kyber keeps reality matching that intent, without you babysitting the machines underneath.

## Whole-filesystem persistence

An agent keeps its entire filesystem across restarts, upgrades, and preemption: installed packages, cloned repos, credentials, and memory. Stopping an agent parks it with its filesystem preserved. Restarting it replaces the underlying pod while preserving its work. This is the defining difference from a throwaway container: the agent picks up where it left off instead of starting from a blank disk.

## A lifecycle you can read at a glance

An agent moves through named phases such as `Creating`, `Starting`, `Running`, `Stopped`, `Suspended`, and `Restarting`. Most transitions are automatic. If the cheaper interruptible machine under an agent is reclaimed, Kyber drains the agent gracefully, parks it, and brings it back when a replacement machine is ready. You see the state change but do not have to act.

Two situations are deliberately human-required, because a silent retry would only hide the real problem: an agent whose stored authorization has expired (`NeedsAuth`), and an agent killed for running out of memory (`MemoryExhausted`). Kyber stops and waits for you instead of retrying into a loop.

## Safe upgrades

When the agent runtime image changes for a whole environment, Kyber rolls agents onto the new image in canary-gated waves. One agent rolls first; the rest keep running on the old image until the canary comes up healthy. A bad image takes down one canary, not the fleet.

Kyber also self-heals the helper containers that run alongside each agent. If a monitoring or transcript sidecar dies, it restarts automatically, so an agent never keeps working invisibly behind a frozen heartbeat.

Manage all of this from the [fleet console](/docs/fleet-console/).

## Learn more

- [Agent lifecycle](https://github.com/matty-v/kyber/blob/main/docs/product/agent-lifecycle.md)
- [Product overview](https://github.com/matty-v/kyber/blob/main/docs/product/overview.md)
