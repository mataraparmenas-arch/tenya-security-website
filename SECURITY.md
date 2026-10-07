# Security Policy

## Tenya Security Website

Security is a core requirement of the Tenya Security website and its supporting infrastructure.

We welcome responsible reports of security vulnerabilities that could affect the confidentiality, integrity or availability of the website or its supporting systems.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please contact:

**[tenyasecure1@gmail.com](mailto:tenyasecure1@gmail.com)**

For security-sensitive reports, please avoid publishing the vulnerability in a public GitHub issue.

Please include, where possible:

* A clear description of the vulnerability
* The affected URL, component or functionality
* Steps required to reproduce the issue
* Potential security impact
* Screenshots or logs where useful
* A suggested mitigation, if known

Please do not include passwords, private keys, authentication tokens or other sensitive credentials in your report.

---

## Responsible Disclosure

Please allow the project maintainers reasonable time to investigate and address a reported vulnerability before publicly disclosing technical details.

Do not:

* Access or modify data belonging to other users
* Perform destructive testing
* Conduct denial-of-service attacks
* Social-engineer employees or users
* Attempt to gain unauthorized access to third-party systems
* Publish exploitable vulnerability details before remediation

---

## Security Priorities

Security issues involving the following areas are treated as high priority:

* Authentication
* Authorization
* Exposure of sensitive information
* Credential leakage
* Cross-site scripting
* Injection vulnerabilities
* Server-side request forgery
* Insecure API endpoints
* Contact-form abuse
* Dependency vulnerabilities
* Configuration errors
* Security-header weaknesses

---

## Supported Version

Security fixes should target the currently deployed production version and the active development branch.

Older versions may not receive security updates.

---

## Dependency Security

Project dependencies should be regularly reviewed and updated.

Automated dependency monitoring should be enabled where supported.

---

## Secrets

Never commit:

* API keys
* Private tokens
* Passwords
* Database credentials
* Cloud credentials
* Authentication secrets
* Private certificates

If a secret is accidentally committed, assume it is compromised and rotate it immediately.

---

## Public Issues

Please do not disclose exploitable security vulnerabilities through public GitHub issues.

Use the security contact above for responsible disclosure.

---

## Acknowledgement

We appreciate responsible security researchers and contributors who help improve the security and reliability of the Tenya Security digital platform.

**TENYA SECURITY GROUP LIMITED**

**INTEGRITY WITH EXCELLENCE**
