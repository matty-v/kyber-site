---
title: Installation
description: The five ways to install Kyber, from a local cluster to a production GCP deployment.
---

Kyber installs from a published Helm chart on any Kubernetes cluster. Pick the path that matches where you want it to run. Each links to the canonical step-by-step guide on GitHub.

## Choose your path

**Try it on a cluster you already have, or a local one.** The [quickstart](https://github.com/matty-v/kyber/blob/main/docs/quickstart.md) takes any cluster (or a k3d one-liner) to a running fleet console with one live agent in about 15 minutes. A condensed version lives at [/docs/quickstart/](/docs/quickstart/).

**Have an AI assistant do the install for you.** You do not have to be a developer. The [install with an AI assistant guide](https://github.com/matty-v/kyber/blob/main/docs/install-with-an-ai-assistant.md) gives you a prompt to paste into Claude Code, Cursor, or ChatGPT that drives the install carefully: plain-language narration, a verify step before moving on, and a pause whenever a step needs you.

**Run it on your Mac.** The [macOS guide](https://github.com/matty-v/kyber/blob/main/docs/installation-macos.md) runs the cluster inside a Linux VM on your Mac. Read its support table first: on Apple Silicon the VM must be x86_64.

**Run it on a Windows laptop, no cloud account.** The [WSL2 guide](https://github.com/matty-v/kyber/blob/main/docs/installation-wsl2.md) is a numbered runbook for a standalone single-box install: native k3s in WSL2 and Tailscale Funnel for a public HTTPS URL.

**Run it on GCP with managed VMs and HTTPS.** The [GCP guide](https://github.com/matty-v/kyber/blob/main/docs/installation.md) is the production install: Terraform-provisioned VMs, numbered steps from secrets to first agent, and a public HTTPS URL.

## A note on trust

Agent pods run with elevated privileges so each agent can keep a whole persistent disk. Give Kyber a cluster you are comfortable trusting the agents with, not a shared production one. The [threat model](https://github.com/matty-v/kyber/blob/main/.github/SECURITY.md#deployment-threat-model) explains why.

## Learn more

- [Install table in the docs index](https://github.com/matty-v/kyber/blob/main/docs/README.md)
- [Upgrading an existing install](https://github.com/matty-v/kyber/blob/main/docs/upgrading.md)
- [Security policy and threat model](https://github.com/matty-v/kyber/blob/main/.github/SECURITY.md)
- [What is Kyber?](/docs/what-is-kyber/)
