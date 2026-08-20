---
title: Use cases
description: What people actually run on Kyber, from personal agent fleets to an autonomous dev team that ships reviewed pull requests.
---

Kyber is the platform layer under the agents. It does not tell your agents what to work on. It gives each of them a durable machine, a way to reach you, and a way to reach each other. What you build on top is up to you.

These pages show fleet shapes that work in practice. All of them run on the same small set of capabilities: [persistent sandboxed pods](/docs/agents-and-persistence/), [two-way chat](/docs/chat-channels/), [git-backed memory](/docs/memory-and-identity/), and [schedules with agent-to-agent handoffs](/docs/scheduled-jobs/).

## The shapes

- **[A personal agent fleet](/use-cases/personal-agent-fleet/)**: long-lived assistants that keep their tools, repos, and memory, on hardware you control.
- **[An autonomous dev team](/use-cases/autonomous-dev-team/)**: agents that take GitHub issues to reviewed, merged pull requests.
- **[Ops from your phone](/use-cases/ops-from-your-phone/)**: run real infrastructure through a Telegram conversation.
- **[Scheduled automation](/use-cases/scheduled-automation/)**: agents on cron that audit, monitor, and report while you sleep.

Most real fleets mix these. An agent on a dev team can also be on a schedule and also answer you on Telegram. The shapes are starting points, not modes.

Ready to try one? Start with the [quickstart](/docs/quickstart/): fifteen minutes from an empty cluster to a fleet console with one live agent.
