# Convertify Panel Plugin

Convertify is a Grafana panel plugin for visualizing numeric time-series values in binary and hexadecimal formats, with optional bit-level status columns.

## Features

- Binary and hexadecimal conversion for numeric values
- Bitfield-style column breakdown for selected status bits
- Field picker to choose which numeric field to transform
- Optional pagination for large result sets
- Configurable text size and text color

## Requirements

- Node.js `>=18 <=22`
- Grafana `>=12.3.0`
- Docker (optional, for local Grafana testing)

## Local development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build in watch mode:

   ```bash
   npm run dev
   ```

3. Start Grafana with the plugin mounted:

   ```bash
   npm run server
   ```

4. Run checks:

   ```bash
   npm run typecheck
   npm run lint
   npm run test:ci
   ```

## React 19 compatibility

The plugin is configured to support Grafana's React 19 runtime preview.
Because JSX runtime is externalized for React 19 compatibility, Grafana versions older than `12.3.0` are not supported.

Run the compatibility scan locally:

```bash
npm run build
npx -y @grafana/react-detect@latest
```

Run against the Grafana React 19 preview image:

```bash
GRAFANA_VERSION=dev-preview-react19 docker compose up --build
```

## E2E tests

```bash
npm run e2e
```

CI is configured to resolve Grafana E2E versions including the React 19 preview image.

## Release

- Update changelog and version
- Build and test locally
- Push a release tag (`vX.Y.Z`) to trigger release workflow

## License

MIT. See [LICENSE](./LICENSE).
