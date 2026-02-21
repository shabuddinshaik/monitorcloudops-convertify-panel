# monitorcloudops-convertify-panel plugin V2.00

## What's changed

- Added React 19 compatibility support for Grafana 13 readiness.
- Externalized `react/jsx-runtime` and `react/jsx-dev-runtime` to avoid plugin loading failures with React 19.
- Set plugin compatibility to Grafana `>=12.3.0`.
- Improved CI by adding React 19 detection and filtering E2E versions to supported Grafana ranges.
- Improved E2E stability by using safer panel navigation timing.
- Updated panel accessibility and rendering performance.
- Removed direct CSS import usage in panel component to satisfy validator code rules.

## Validation

- `npm run build` ✅
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npx -y @grafana/react-detect@latest` ✅

## Packaging

- Plugin package: `monitorcloudops-convertify-panel-2.0.0.zip`
- SHA1: `6f337cf226f840365879ca33c2a9af5e07b2e579`
- MD5: `a43cee1ca6c88904f6bb9c4428ba9511`

## Notes

- This release supersedes earlier 2.0.0 packaging attempts with corrected validator-compatible packaging and checksum.
