# Gods Eye - Electron App

A comprehensive monitoring and analysis desktop application built with Electron, React, and Node.js.

## Features

- 🖥️ **Desktop Application**: Native desktop experience with Electron
- 🎨 **Modern UI**: Beautiful React interface with Tailwind CSS
- 🔧 **Backend API**: Express.js server for data management
- 📊 **Real-time Monitoring**: Live data visualization and analysis
- 🔒 **Secure**: Built with security best practices

## Project Structure

```
Gods-Eye/
├── electron/          # Electron main process files
├── frontend/          # React frontend application
├── backend/           # Express.js backend API
├── ml-fraud-detection/ # Machine learning components
└── package.json       # Root package configuration
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gods-Eye
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   
   # Install backend dependencies
   cd backend && npm install && cd ..
   ```

## Development

### Running in Development Mode

```bash
# Start the complete development environment
npm run dev
```

This command will:
- Start the backend server on port 3001
- Start the React development server on port 5173
- Launch the Electron app in development mode

### Individual Components

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Electron only (requires frontend to be running)
npm run dev:electron
```

## Building for Production

### Build the Application

```bash
# Build frontend and create Electron app
npm run build
```

### Create Distribution Packages

```bash
# Create platform-specific packages
npm run dist
```

This will create:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` file
- **Linux**: `.AppImage` file

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start complete development environment |
| `npm run build` | Build frontend and Electron app |
| `npm run start` | Run production build |
| `npm run pack` | Package app without distribution |
| `npm run dist` | Create distribution packages |

## API Endpoints

The backend provides the following API endpoints:

- `GET /api/health` - Health check
- `GET /api/status` - Application status
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get specific transaction
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/stats/summary` - Transaction statistics

## Development Notes

### Electron Configuration

- **Main Process**: `electron/electron-main.js`
- **Preload Script**: `electron/preload.js`
- **Security**: Context isolation enabled, nodeIntegration disabled

### Frontend

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Components**: Modular component architecture

### Backend

- **Framework**: Express.js
- **Port**: 3001 (configurable via PORT environment variable)
- **Security**: Helmet.js, CORS enabled

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3001 (backend) and 5173 (frontend) are available
2. **Dependencies**: Run `npm install` in all directories if you encounter module errors
3. **Electron build**: Make sure you have the necessary build tools for your platform

### Development Tips

- Use `Ctrl+Shift+I` (or `Cmd+Option+I` on macOS) to open DevTools in the Electron app
- The backend logs will appear in the terminal where you started the development server
- Hot reload is enabled for both frontend and backend in development mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.

---

###  🛠️ Creators

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/psykickguy">
        <img src="https://github.com/psykickguy.png" width="60px;" alt="psykickguy"/>
      </a>
      <br /><sub><b>psykickguy</b></sub>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/Patrick-ayo">
        <img src="https://github.com/Patrick-ayo.png" width="60px;" alt="Patrick-ayo"/>
      </a>
      <br /><sub><b>Patrick-ayo</b></sub>
      <br />
    </td>
    <td align="center">
      <a href="https://github.com/prem-2802">
        <img src="https://github.com/prem-2802.png" width="60px;" alt="prem-2802"/>
      </a>
      <br /><sub><b>Prem Dongare</b></sub>
      <br />
    </td>
  </tr>
</table>
