---
title: Multi-cluster and the API
description: Run several Kyber clusters from one hub, and automate everything through the REST API with API keys.
---

Kyber scales from one box to several clusters, and everything the console does is backed by a REST API you can call yourself. That means the same platform covers a laptop experiment, a production install, and scripts that automate both.

## Several clusters, one place

Each Kyber install is its own cluster with its own console. For operators running more than one, Holocron is a multi-cluster hub: it mounts the same console once per cluster, so you move between installs without juggling URLs or separate logins. Every screen shows a cluster identifier with the cluster's name and version, so you always know which cluster and which build you are about to act on.

Clusters follow a simple naming convention: the logical name is the Helm release name, in the `kyber-<env>` pattern, such as `kyber-laptop` or `kyber-gcp`. Pick a name that describes the environment's role, not its hardware, and keep it stable. The values file plus the release name is the complete definition of a Kyber install.

## The API and its keys

All operator-facing requests go through the control plane's REST API under `/api/v1/*`, authorized by the Kyber API key: a single 256-bit credential generated at install time. The console itself is a client of this API, exchanging the key once for a session cookie rather than keeping it in browser storage.

The key can be rotated programmatically with no downtime: one authenticated call swaps the key, and the old one stops working on the next request. A manual rotation path exists for compromise recovery.

For agent lifecycle actions, you can also issue scoped keys. A `lifecycle:write` key can start, stop, and restart agents; the more impactful suspend and force-re-auth verbs need `lifecycle:admin`. Enforcement is opt-in per cluster, so you can define scoped callers, watch the audit log, and then turn enforcement on.

## Learn more

- [Cluster naming convention](https://github.com/matty-v/kyber/blob/main/docs/clusters.md)
- [Kyber platform API keys](https://github.com/matty-v/kyber/blob/main/docs/api-keys.md)
- [Operator surfaces: the PWA and Holocron](https://github.com/matty-v/kyber/blob/main/docs/product/pwa-holocron.md)
