# PharmaClick Frontend

Next.js frontend application for PharmaClick, a pharmacy helper application.

## Features

- Medication reminders
- Chatbot for medication information
- User profiles and settings
- Notification system

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Docker Deployment

### Build and run with Docker

```bash
# Build the Docker image
docker build -t pharmaclick-frontend .

# Run the container
docker run -p 3000:3000 pharmaclick-frontend
```

### Using Docker Compose

```bash
# Build and start the container
docker-compose up -d

# Stop the container
docker-compose down
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://your-backend-url/api
```

## License

This project is proprietary and confidential. 