---
title: What is Kyber?
description: A self-hosted platform for running and managing a fleet of long-lived AI agents on a Kubernetes cluster.
---

Kyber runs and manages your fleet of AI agents on a Kubernetes cluster. Each agent gets full autonomous access to its own sandboxed pod, including disk, tools, repos, and memory, and keeps all of it across restarts. You manage the fleet from a web console, the API, or from Telegram and Discord on your phone. It is made to run with the Claude or ChatGPT subscription you already pay for.

## The mental model

An agent in Kyber is not a chat session. It is long-lived infrastructure: a worker with its own sandboxed pod, its own persistent filesystem, its own identity, and its own model. Installed packages, cloned repos, credentials, and memory all survive restarts, upgrades, and machine preemption.

You declare what you want, an agent of a certain shape on a certain kind of machine, and Kyber works to make reality match that intent and keep it there. Agents run on machines: cloud VMs Kyber provisions for you (on GCP, preemptible included), or nodes that already exist in your cluster. Cron inside each agent survives restarts, and agents can send each other signed messages, so one agent's output becomes another's next prompt.

## What ships in the box

- **A control plane** that manages agents and machines, plus in-cluster Postgres and Redis. Everything installs from a published Helm chart.
- **The fleet console**, a browser PWA served by the control plane: agent status, per-agent context pressure, a live terminal into any running agent.
- **Two agent runtimes**: Claude Code and Codex. Claude Code agents sign in with your Claude subscription, Codex agents with your ChatGPT subscription. API keys work too. See [Runtimes](/docs/runtimes/).
- **Telegram and Discord channels** for two-way chat with any agent, no terminal needed. See [Chat channels](/docs/chat-channels/).

## Who it is for

Kyber is for operators who want to own the whole environment, not just the agent: pick each agent's machine, disk, CPU, and memory, reboot it, stop it, or open a shell into it. It is self-hosted, licensed Apache 2.0, at v1.x, solo-maintained, and runs the maintainer's own fleets every day.

Ready to try it? Start with the [Quickstart](/docs/quickstart/) or browse the [install options](/docs/installation/).

## Learn more

- [Kyber on GitHub](https://github.com/matty-v/kyber)
- [Product overview](https://github.com/matty-v/kyber/blob/main/docs/product/overview.md)
- [Architecture overview](https://github.com/matty-v/kyber/blob/main/docs/architecture/overview.md)
