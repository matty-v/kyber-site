---
title: Quickstart
description: Get a running Kyber with one live agent in about 15 minutes, on any Kubernetes cluster.
---

Get a running Kyber with one live agent in about 15 minutes, on any Kubernetes cluster, using the published Helm chart. No cloud account, no Terraform, no fork.

This page is the condensed version. The [full quickstart on GitHub](https://github.com/matty-v/kyber/blob/main/docs/quickstart.md) walks the same path with a verify step at every stage, plus recovery pointers when something does not match. Use it for your first real install.

## Prerequisites

- `kubectl` 1.33 or newer, `helm` 3.14 or newer (for OCI registry support), `openssl`, and `curl` and `jq` for the verify steps.
- A Kubernetes cluster running 1.33 or newer with containerd 2.0 or newer, which admits `CAP_SYS_ADMIN`. Agents run in a user namespace so that in-pod root maps to an unprivileged uid on the node. Below those versions, agents refuse to start rather than run unisolated.

No cluster? [k3d](https://k3d.io) gives you one on Docker in about 30 seconds:

```bash
k3d cluster create kyber --no-lb --wait --image rancher/k3s:v1.34.6-k3s1
```

## Install

Kyber installs from a published Helm chart that carries its own image tags. Nothing to pin, no registry credentials, no fork.

```bash
kubectl create namespace kyber-system
kubectl -n kyber-system create secret generic kyber-internal-signing-key \
  --from-literal=signing-key="$(openssl rand -hex 32)"

# Keep this. It is how you log in to the PWA and the API.
export KYBER_API_KEY=$(openssl rand -hex 32)

helm install kyber oci://ghcr.io/matty-v/charts/kyber \
  --version 1.0.8 \
  --namespace kyber-system \
  --set namespace.create=false \
  --set api.apiKey="$KYBER_API_KEY" \
  --set api.webhookSecret="$(openssl rand -hex 32)" \
  --wait --timeout 10m
```

Use the newest version from [Releases](https://github.com/matty-v/kyber/releases) in place of `1.0.8`. The chart version and the release tag are the same number.

## What you get

A Kyber control plane, its PWA, Postgres, Redis, and everything needed to run your first agent in a pod with whole-disk persistence. Agents schedule onto the cluster node you already have; no VMs are provisioned. Cloud machine provisioning is the only part of Kyber this quickstart does not exercise.

Open the fleet console with a port-forward:

```bash
kubectl -n kyber-system port-forward svc/kyber-control-plane 8080:8080 &
```

Then visit `http://localhost:8080/` and paste `$KYBER_API_KEY` when asked.

## Your first agent

First create a machine (where agents run). In the PWA, under Machines, create one named `local` with provider `mock`. With the mock provider it attaches to the node you already have and reaches `Ready` immediately; only VM provisioning is skipped, nothing about the agent is simulated.

Then create the agent. Under Agents, create one with runtime `claude-code`, pick a model, and click Authorize with Claude. The PWA runs the whole OAuth exchange with Anthropic; paste the authorization code it gives you. Every later pod boot refreshes the access token on its own, so the agent comes up already logged in.

Open the agent in the PWA and use the terminal tab to talk to it.

For the verify commands at each of these steps, and the teardown order that avoids stranding the namespace, follow the [full quickstart guide](https://github.com/matty-v/kyber/blob/main/docs/quickstart.md).

## Learn more

- [Full quickstart with verify steps](https://github.com/matty-v/kyber/blob/main/docs/quickstart.md)
- [All install options](/docs/installation/)
- [Chat with agents from Telegram or Discord](/docs/chat-channels/)
- [Give agents persistent memory and a persona](/docs/memory-and-identity/)
- [Upgrading an install](https://github.com/matty-v/kyber/blob/main/docs/upgrading.md)
