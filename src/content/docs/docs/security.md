---
title: Security Model
description: What Kyber's agent pods can do, which cluster to give them, and what the threat model does and does not cover.
---

Kyber runs long-lived AI agents with substantial power by design. This page states plainly what that means for the cluster you give it.

## Agent pods run with elevated privileges

Agent runtime pods are not privileged by default, but they retain `CAP_SYS_ADMIN` and mount `/dev/fuse` from the host. That is what lets each agent keep a whole persistent disk: its filesystem, tools, repos, and memory survive restarts. The trade is real: an agent pod is not strongly isolated from the node it runs on.

## Give Kyber a dedicated cluster

Deploy Kyber on a cluster whose workloads and credentials you are willing to trust the agents with. Not a shared production cluster. Treat the cluster as the blast radius of the agents it hosts.

## Chat channels are an input surface

Agents accept prompts from connected Telegram and Discord channels. Anyone who can message a bound channel can influence what an agent does. Grant channel bindings deliberately.

## What the threat model covers

Bypasses of Kyber's own boundaries are always in scope for security reports: API authentication, webhook HMAC verification, secret handling, and sidecar forwarding. Reports that assume a hostile agent escaping an appropriately dedicated cluster, or abuse by a user who was deliberately granted a chat binding, may be treated as configuration guidance rather than vulnerabilities.

## Reporting and support

Only the latest minor release receives security fixes. Report vulnerabilities privately through [GitHub's private reporting](https://github.com/matty-v/kyber/security/advisories/new), not a public issue. Kyber has a solo maintainer: expect a reply within about a week, on a best-effort basis, with no formal SLA.

## Learn more

- [Security policy and deployment threat model](https://github.com/matty-v/kyber/blob/main/.github/SECURITY.md)
- [Architecture](/docs/architecture/): how the components fit together
