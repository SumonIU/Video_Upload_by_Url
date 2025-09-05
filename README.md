# Bunny.net Video Uploader API

A powerful AdonisJS API service that integrates with Bunny.net Stream to upload videos from URLs and manage video content.

## Features

- ✅ Upload videos to Bunny.net from URLs
- ✅ Create, read, update, and delete videos
- ✅ List videos with pagination and search
- ✅ Comprehensive request validation
- ✅ Error handling and logging
- ✅ TypeScript support
- ✅ RESTful API design

## Prerequisites

- Node.js (v18.19.1 or higher)
- npm or yarn
- Bunny.net Stream account with API access

## Setup Instructions

### 1. Clone and Install

```bash
# Navigate to project directory
cd project-1

# Install dependencies
npm install
```

### 2. Environment Configuration

Copy the environment example file and configure your Bunny.net credentials:

```bash
cp .env.example .env
```

Update your `.env` file with your Bunny.net Stream API credentials:

```env
# Bunny.net Stream API Configuration
BUNNY_STREAM_API_KEY=your_bunny_stream_api_key_here
BUNNY_STREAM_LIBRARY_ID=your_stream_library_id_here
BUNNY_STREAM_BASE_URL=https://video.bunnycdn.com
```

### 3. Getting Bunny.net Credentials

1. **Sign up** for a Bunny.net account at [https://bunny.net](https://bunny.net)
2. **Create a Stream Library**:
   - Go to Stream → Libraries
   - Click "Add Stream Library"
   - Note your Library ID
3. **Get API Key**:
   - Go to Account → API
   - Copy your Stream API Key

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The API will be available at `http://localhost:3333`

## API Endpoints

### Base URL
```
http://localhost:3333/api/v1
```

### 1. Upload Video from URL

**POST** `/videos/upload-from-url`

Upload a video to Bunny.net Stream by providing a URL.

#### Request Body
```json
{
  "videoUrl": "https://example.com/video.mp4",
  "title": "My Awesome Video",
  "collectionId": "optional-collection-id"
}
```

#### Response
```json
{
  "message": "Video upload initiated successfully",
  "data": {
    "videoId": "video-guid-here",
    "title": "My Awesome Video",
    "uploadTask": "task-id-here",
    "video": {
      "videoLibraryId": "library-id",
      "guid": "video-guid-here",
      "title": "My Awesome Video",
      "status": 0,
      "encodeProgress": 0,
      // ... other video properties
    }
  }
}
```

### 2. List Videos

**GET** `/videos`

Get a paginated list of all videos in your library.

#### Query Parameters
- `page` (number, optional): Page number (default: 1)
- `itemsPerPage` (number, optional): Items per page (default: 10)
- `search` (string, optional): Search query
- `collection` (string, optional): Filter by collection ID
- `orderBy` (string, optional): Order results by field

#### Example Request
```
GET /api/v1/videos?page=1&itemsPerPage=20&search=awesome
```

#### Response
```json
{
  "message": "Videos retrieved successfully",
  "data": {
    "items": [...],
    "currentPage": 1,
    "itemsPerPage": 20,
    "totalItems": 45
  }
}
```

### 3. Get Video Details

**GET** `/videos/:id`

Get details of a specific video by its ID.

#### Response
```json
{
  "message": "Video retrieved successfully",
  "data": {
    "videoLibraryId": "library-id",
    "guid": "video-guid-here",
    "title": "My Awesome Video",
    "length": 120,
    "status": 4,
    "encodeProgress": 100,
    // ... other video properties
  }
}
```

### 4. Update Video

**PUT** `/videos/:id`

Update video metadata and properties.

#### Request Body
```json
{
  "title": "Updated Video Title",
  "collectionId": "new-collection-id",
  "chapters": [
    {
      "title": "Introduction",
      "start": 0,
      "end": 30
    }
  ],
  "moments": [
    {
      "label": "Key Point",
      "timestamp": 45
    }
  ],
  "metaTags": [
    {
      "property": "description",
      "value": "Updated description"
    }
  ]
}
```

#### Response
```json
{
  "message": "Video updated successfully",
  "data": {
    // Updated video object
  }
}
```

### 5. Delete Video

**DELETE** `/videos/:id`

Delete a video from Bunny.net Stream.

#### Response
```json
{
  "message": "Video deleted successfully"
}
```

## Video Status Codes

Bunny.net uses the following status codes for videos:

- `0` - Created (not uploaded yet)
- `1` - Uploaded (processing)
- `2` - Processing failed
- `3` - Encoding
- `4` - Finished (ready to stream)
- `5` - Resolution finished

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message",
  "errors": {
    "field": "Validation error message"
  }
}
```

## HTTP Status Codes

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Request Validation

### Video Upload Validation
- `videoUrl`: Must be a valid HTTP/HTTPS URL (max 2000 characters)
- `title`: Required, 1-255 characters
- `collectionId`: Optional, max 255 characters

### Video Update Validation
- `title`: Optional, 1-255 characters when provided
- `collectionId`: Optional, max 255 characters
- `chapters`: Array of chapter objects with title, start, and end times
- `moments`: Array of moment objects with label and timestamp
- `metaTags`: Array of meta tag objects with property and value

## Project Structure

```
project-1/
├── app/
│   ├── Controllers/Http/
│   │   └── VideosController.ts     # Video API endpoints
│   ├── Services/
│   │   └── BunnyStreamService.ts   # Bunny.net API integration
│   └── Validators/
│       ├── VideoUploadValidator.ts # Upload validation
│       └── VideoUpdateValidator.ts # Update validation
├── start/
│   └── routes.ts                   # API route definitions
├── .env                            # Environment configuration
└── README.md                       # This file
```

## Development

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run format
```

### Type Checking
```bash
npm run type-check
```

## Deployment

1. Set up your production environment variables
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

## Troubleshooting

### Common Issues

1. **Invalid API Key Error**
   - Verify your `BUNNY_STREAM_API_KEY` is correct
   - Ensure the API key has Stream permissions

2. **Library Not Found**
   - Check your `BUNNY_STREAM_LIBRARY_ID` is correct
   - Ensure the library exists in your Bunny.net account

3. **Video Upload Fails**
   - Verify the video URL is publicly accessible
   - Check the video format is supported by Bunny.net
   - Ensure sufficient storage quota in your account

## Support

For issues related to:
- **This API**: Check the GitHub issues or create a new one
- **Bunny.net Platform**: Visit [Bunny.net Support](https://support.bunny.net/)
- **AdonisJS Framework**: Check [AdonisJS Documentation](https://docs.adonisjs.com/)

## License

This project is licensed under the ISC License.

---

Built with ❤️ using [AdonisJS](https://adonisjs.com/) and [Bunny.net](https://bunny.net/)
# Video_Upload_by_Url
