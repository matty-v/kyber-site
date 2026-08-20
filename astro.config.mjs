// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// SITE_BASE lets CI build a temporary preview under a sub-path
// (e.g. GitHub Pages) without touching the production config.
const base = process.env.SITE_BASE || '/';
const site = process.env.SITE_URL || 'https://kyber.voget.io';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [
		starlight({
			title: 'Kyber',
			description:
				'Run and manage your fleet of AI agents on a Kubernetes cluster. Sandboxed pods, persistent disks, chat from your phone, powered by the subscriptions you already pay for.',
			logo: {
				light: './src/assets/kyber-lockup-light.svg',
				dark: './src/assets/kyber-lockup-dark.svg',
				replacesTitle: true,
			},
			favicon: '/favicon.svg',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/matty-v/kyber' },
			],
			editLink: {
				baseUrl: 'https://github.com/matty-v/kyber-site/edit/main/',
			},
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: `${site}/og-image.png` },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
			],
			sidebar: [
				{
					label: 'Getting started',
					items: [
						{ label: 'What is Kyber?', slug: 'docs/what-is-kyber' },
						{ label: 'Quickstart', slug: 'docs/quickstart' },
						{ label: 'Installation options', slug: 'docs/installation' },
					],
				},
				{
					label: 'Capabilities',
					items: [
						{ label: 'The fleet console', slug: 'docs/fleet-console' },
						{ label: 'Agents and persistence', slug: 'docs/agents-and-persistence' },
						{ label: 'Chat: Telegram and Discord', slug: 'docs/chat-channels' },
						{ label: 'Memory and identity', slug: 'docs/memory-and-identity' },
						{ label: 'Scheduled jobs and agent-to-agent', slug: 'docs/scheduled-jobs' },
						{ label: 'Runtimes and subscriptions', slug: 'docs/runtimes' },
						{ label: 'Multi-cluster and the API', slug: 'docs/multi-cluster-and-api' },
					],
				},
				{
					label: 'Use cases',
					items: [
						{ label: 'Overview', slug: 'use-cases' },
						{ label: 'A personal agent fleet', slug: 'use-cases/personal-agent-fleet' },
						{ label: 'An autonomous dev team', slug: 'use-cases/autonomous-dev-team' },
						{ label: 'Ops from your phone', slug: 'use-cases/ops-from-your-phone' },
						{ label: 'Scheduled automation', slug: 'use-cases/scheduled-automation' },
					],
				},
				{
					label: 'Project',
					items: [
						{ label: 'Architecture', slug: 'docs/architecture' },
						{ label: 'Security model', slug: 'docs/security' },
						{ label: 'FAQ', slug: 'docs/faq' },
					],
				},
			],
		}),
	],
});
