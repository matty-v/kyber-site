---
title: Runtimes
description: Run agents on Claude Code or Codex, signed in with the Claude or ChatGPT subscription you already pay for.
---

Kyber supports two agent runtimes: Claude Code and Codex. Both run inside the standard Kyber agent pod, use whole-disk persistence, receive inbound work through Kyber's signed dispatch path, and expose the same lifecycle actions. You pick the runtime per agent.

## Use the subscription you already have

Claude Code agents sign in with your Claude subscription, and Codex agents with your ChatGPT subscription, instead of paying per token. API keys work too.

For Codex, subscription login is the default. After you create a Codex agent, its pod runs `codex login --device-auth` and the agent-detail page shows the resulting URL and device code. You complete the login with your ChatGPT account. The refreshed credential is kept alive across pod replacements, so the login stays active for as long as Codex and OpenAI allow. If credentials ever become invalid, the agent enters `NeedsAuth` and a **Start device login** action on the agent-detail page runs the same flow again.

Codex also supports an explicit OpenAI API key mode, chosen at creation time.

## Adopting new versions and models

The control plane runs a detection poller that periodically queries the npm registry and the Anthropic Models API to discover newly released Claude Code versions and Claude models. The console's picker reads from that feed, so you can adopt a new version or model with no Kyber code change and no rebuild. Detection failures are handled softly: the last known list keeps serving, and agents are never disrupted by a detection outage.

The same detection feed reports each model's real context window, which is what keeps the console's token-budget gauges honest for brand-new models.

Version pinning is deliberate. Codex's startup self-update check is disabled because Kyber centrally manages the pinned harness; a **Set harness version** action upgrades or downgrades explicitly. Agents keep their identity, memory, and disk across a runtime change, because those live in [whole-pod persistence](/docs/agents-and-persistence/) and [identity repos](/docs/memory-and-identity/).

## Learn more

- [Agent runtimes](https://github.com/matty-v/kyber/blob/main/docs/runtimes.md)
- [Runtime detection](https://github.com/matty-v/kyber/blob/main/docs/runtime-detection.md)
