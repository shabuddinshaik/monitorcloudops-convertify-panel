# Convertify Panel for Grafana

**Convertify** is a powerful panel plugin for Grafana designed to help visualize real-time data with detailed bit-level analysis. It integrates with Grafana's time-series data and transforms it into binary or hexadecimal representations. This plugin is perfect for monitoring and analyzing data with bitfield structures, such as industrial systems, IoT devices, or control systems.

## Features

- **Real-time Data Visualization**: Visualizes time-series data from Grafana.
- **Binary and Hexadecimal Conversion**: Convert numerical values into binary or hexadecimal formats.
- **Bit-Level Representation**: Show bit-level status using predefined bitfields (e.g., Status, Stop, Emergency Stop).
- **Pagination**: Data is displayed in pages, making it easy to navigate large datasets.
- **Flexible Data Input**: Works with any time-series data with numerical values.
- **Customizable Text Size**: Adjust text size for better readability.
- **Dynamic Text Color**: Select text colors based on the Grafana theme.

## How It Works

The panel works by transforming numerical values into binary or hexadecimal formats and displaying them in a table along with their corresponding bitfield values.

### Key Concepts:
- **Binary Conversion**: Each numerical value is converted into a 32-bit binary representation.
- **Hex Conversion**: The panel can also convert values into a hexadecimal format.
- **Bitfields**: Each value is analyzed according to predefined bitfields (e.g., Status, Stop, Fault Stop), where each bit represents a specific status (set or clear).

## Expected Data Format

For the plugin to work, you need a time-series dataset that contains both time and numerical fields. Here's an example of the expected data:

| Timestamp           | Value |
|---------------------|-------|
| 2025-01-01 12:00:00 | 1024  |
| 2025-01-01 12:01:00 | 2048  |

- **Time**: A field containing timestamp data (required).
- **Value**: A numerical field representing the data to be visualized (required).

## Installation

1. **Download the Plugin**: Clone the repository and install dependencies.
   ```sh
   git clone https://github.com/shabuddinshaik/monitorcloudops-convertify-panel.git
   cd monitorcloudops-convertify-panel
   yarn install
   ```
2. **Build the Plugin**:
   ```sh
   yarn build
   ```
3. **Deploy the Plugin**: Copy the built plugin into your Grafana plugins directory.
   ```sh
   cp -r dist /var/lib/grafana/plugins/convertify-panel
   ```
4. **Restart Grafana**:
   ```sh
   sudo systemctl restart grafana-server
   ```
5. **Enable the Plugin**: Go to Grafana settings and enable the Convertify panel.

## Using the Plugin

1. **Add the Panel to a Dashboard**: Once installed, add the Convertify panel to your dashboard like any other panel.
2. **Configure the Data Source**: Choose a data source that provides time-series data with numerical values.
3. **Select Conversion Type**: Choose whether to visualize the data as binary, hexadecimal, or both.
4. **Use Filters**: Apply filters to view data for specific bitfields.
5. **Navigate through Pages**: Use the pagination buttons to navigate through large datasets.

## Configuration Options

- **Text Size**: Choose between small, medium, or large text size.
- **Field Selection**: Pick a numerical field from your dataset.
- **Conversion Type**: Display data in binary, hexadecimal, or both formats.
- **Text Color**: Customize text color dynamically based on Grafana's theme.
- **Show Constant Columns**: Toggle to show or hide the bitfield columns for status monitoring.

## Screenshots

![Panel Screenshot 1](https://github.com/shabuddinshaik/monitorcloudops-convertify-panel/blob/main/src/img/screenshot1.png)

![Panel Screenshot 2](https://github.com/shabuddinshaik/monitorcloudops-convertify-panel/blob/main/src/img/screenshot2.png)

## License

This plugin is licensed under the MIT License. See the [LICENSE](https://github.com/shabuddinshaik/monitorcloudops-convertify-panel/blob/main/LICENSE) file for more details.

## Contribution

We welcome contributions! If you find a bug or have a feature request, feel free to open an issue or submit a pull request. Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Added a new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

---

Thank you for using Convertify! 🚀 If you have any questions, feel free to reach out via GitHub issues.

