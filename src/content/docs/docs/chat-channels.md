---
title: Chat channels
description: Two-way Telegram and Discord conversations with any agent, from your phone, with no terminal needed.
---

You can talk to any Kyber agent over Telegram or Discord, in both directions. That means you can assign work, answer an agent's question, and get results from your phone, without opening a terminal.

## What a channel is

A comms channel connects one agent to one bot. You configure it from the agent's Comms tab in the console, or through the same API it calls. Each channel needs a bot token and an allowlist of user IDs; nobody outside the allowlist can drive the agent. Credentials are write-only: tokens go in but are never returned by any endpoint, and the agent runtime itself never sees the bot token. The token lives in a sidecar that bridges the chat service to Kyber's signed inbound dispatcher.

## What conversations look like

Over Telegram, you can send text, edits, files, photo and video albums, inline-button selections, and reactions. While the agent works, Telegram shows its typing indicator. The agent can reply with text and files, thread a reply, react, edit earlier messages, and offer inline button keyboards. Media uses Telegram-native presentation, so photos arrive as photos and albums arrive as albums.

Over Discord, an accepted message gets an eyes reaction and a typing indicator while the agent works, then a checkmark once it replies. Long replies split cleanly at Discord's message limit with code blocks preserved. A `mentionOnly` setting lets an agent share a channel with humans and respond only when tagged. Threads, reply references, and recent conversation context are forwarded so follow-ups make sense.

## One practical difference

Telegram can reach a suspended agent. Discord delivers messages only over a live gateway connection held by the agent's pod, so Discord agents should be kept running: messages sent while a Discord agent sleeps are lost.

Both channels work with either the Claude Code or Codex [runtime](/docs/runtimes/).

## Learn more

- [Configuring an agent's comms channels](https://github.com/matty-v/kyber/blob/main/docs/agents-comms.md)
- [Telegram channel](https://github.com/matty-v/kyber/blob/main/docs/product/telegram.md)
- [Two-way Discord for agents](https://github.com/matty-v/kyber/blob/main/docs/agents-discord-two-way.md)
