---
title: Memory and identity
description: Give each agent a private git repository that holds its persona, long-term memory, and skills.
---

An identity repo is a private GitHub repository that backs an agent's durable identity: who it is, what it has learned, and how it works. Because identity lives in git, it is versioned, and it survives even a full teardown of the agent.

## What lives in the repo

The repo holds the agent's persona files, long-term memory in `memory/`, session state in `state/` and `.runtime/`, and optional skills and configuration. Contrast this with the default: without an identity repo, an agent's instructions are generated once at pod start, and learnings and session summaries are lost when the pod is replaced.

The template is runtime-neutral. `AGENTS.md` is the identity contract read directly by Codex, and `CLAUDE.md` is Claude Code's entrypoint to the same contract, so shared memory, state, and skills work in either [runtime](/docs/runtimes/).

## Three creation modes

When you create an agent, you choose one of three modes:

- **Create new from template**: Kyber scaffolds a private repo for the agent from a template, with no GitHub setup on your part beyond the one-time platform GitHub App registration.
- **Link existing repo**: bring your own repo, fork another agent's, or migrate an agent you set up by hand.
- **None**: run the agent without a managed identity repo, exactly as before the feature existed.

## Credentials you never manage

The agent reads and writes its own identity repo with a short-lived token minted by the Kyber Platform GitHub App, scoped to just that repo. Nothing is baked into the agent's git config, and an agent can only ever mint the token for its own repo. If the credential path breaks, git fails loudly instead of silently falling back to a broader token.

On every restart, the agent re-syncs its repo, so it picks up right where it left off. When you delete an agent, Kyber preserves the repo: memory and session history are valuable post-mortem, and deleting them is your call, not the platform's.

## Learn more

- [Agent identity repos](https://github.com/matty-v/kyber/blob/main/docs/agents-identity-repos.md)
