---
title: Scheduled jobs and handoffs
description: Cron inside every agent that survives restarts, plus signed agent-to-agent messages for handing work between agents.
---

Agents can put themselves on schedules and hand work to each other. Cron runs inside every agent pod out of the box, and jobs survive restarts, so a nightly report or an hourly check keeps firing without any external scheduler.

## Cron that persists

Any cron job installed at the user or system level survives pod restarts and is picked up by a fresh daemon on the next boot. The supported surfaces are the standard ones:

- `crontab -e` for per-user schedules
- `sudo crontab -e` for the root crontab
- `/etc/crontab` and `/etc/cron.d/<name>` for system-level jobs
- The `/etc/cron.hourly/`, `cron.daily/`, `cron.weekly/`, and `cron.monthly/` directories

The daemon is already started for you; there is no service to enable. Persistence works because the agent's root filesystem is a real directory on its persistent volume, so a write to `/etc/cron.d/` is just a write to durable disk. A newer base image merges into an existing root without overwriting files the agent has touched, so an edited cron file survives a Kyber upgrade too.

If a job goes missing, the source doc below walks through the debugging steps, from checking the daemon to inspecting the pod's persistence mode.

## Agents handing work to each other

Schedules get more interesting when agents cooperate. Agents send each other signed messages, so one agent's output becomes another agent's next prompt, and can wake it from sleep. Messages arrive through the same signed, rate-limited inbound dispatcher that external senders and [chat channels](/docs/chat-channels/) use, so an agent-to-agent handoff is verified the same way as any other inbound work.

Put the two together and you get pipelines with no orchestrator to run: a cron job in one agent kicks off its work, and its result wakes the next agent in the chain.

## Learn more

- [Scheduled jobs on agents](https://github.com/matty-v/kyber/blob/main/docs/agents-scheduled-jobs.md)
- [Configuring an agent's comms channels](https://github.com/matty-v/kyber/blob/main/docs/agents-comms.md)
