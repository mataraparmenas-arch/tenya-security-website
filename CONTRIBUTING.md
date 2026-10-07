# Contributing to Tenya Security Website

Thank you for contributing to the Tenya Security website.

This project represents the digital presence of **Tenya Security Group Limited**, so every contribution should maintain a high standard of quality, security, accessibility and brand consistency.

## Before You Start

Please ensure your changes:

* Preserve the Tenya brand identity
* Use the approved color system
* Work on mobile and desktop
* Do not introduce unnecessary dependencies
* Do not expose secrets
* Do not fabricate company claims
* Maintain accessibility
* Maintain good performance

## Development

Install dependencies:

```bash
npm install
```

Start development:

```bash
npm run dev
```

## Validation

Before submitting a pull request:

```bash
npm run lint
npm run build
```

Also test:

* Mobile navigation
* Contact form
* CTA links
* Keyboard navigation
* Responsive layouts
* Reduced-motion behavior
* Major browsers

## Pull Requests

A pull request should contain:

### Summary

Explain what changed.

### Motivation

Explain why the change was needed.

### Testing

Explain how the change was tested.

### Security

Mention any security implications.

### Accessibility

Mention any accessibility considerations.

## Commit Messages

Prefer concise, descriptive commits.

Examples:

```text
feat: add commercial security services section
fix: improve mobile navigation accessibility
fix: validate contact form inputs
refactor: simplify service card components
docs: update deployment instructions
security: harden contact form validation
```

## Brand Rules

Use only the official palette:

```text
#060630
#F50406
#FFFFFF
#F5F6FA
```

Do not introduce unrelated brand colors.

## Content Rules

Do not publish unverified claims about:

* Clients
* Contracts
* Certifications
* Awards
* Security statistics
* Testimonials
* Government relationships
* Personnel numbers

When uncertain, ask the project owner before publishing.

## Security

Never commit credentials or secrets.

If you discover a vulnerability, follow [`SECURITY.md`](./SECURITY.md) rather than opening a public issue.

## Code Quality

Prefer:

* Small reusable components
* Strong TypeScript types
* Semantic HTML
* Accessible interfaces
* Server-side validation
* Minimal dependencies
* Clear naming
* Maintainable architecture

Avoid:

* Dead code
* Unnecessary packages
* Hard-coded secrets
* Unvalidated user input
* Accessibility regressions
* Excessive animation
* Unnecessary client-side JavaScript
