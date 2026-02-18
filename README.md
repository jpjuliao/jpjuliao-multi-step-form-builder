# Multi-Step Form Builder Wordpress Plugin

A comprehensive WordPress plugin that allows you to create beautiful, multi-step forms with a drag-and-drop interface.

## Features

### Admin Interface
- **Visual Form Builder**: React-based drag-and-drop interface for creating forms
- **Form Header**: Custom title and description with toggle controls
- **Multiple Field Types**: Text, email, textarea, select, radio, checkbox, number, phone, URL, and date fields
- **Step Management**: Add, remove, and reorder steps easily
- **Field Configuration**: Customize labels, placeholders, validation, help text, and more
- **Display Settings**: Configure modal popup options (on load, with delay)
- **Form Settings**: Configure button labels and success messages
- **Submissions Management**: View, export (CSV), and delete form submissions

### Frontend Display
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Progress Indicator**: Visual progress bar showing current step
- **Step Navigation**: Next/Previous buttons with smooth transitions
- **Form Validation**: Client-side and server-side validation
- **AJAX Submission**: No page reload on form submission
- **Success Messages**: Customizable success messages after submission

### Data Management
- **Database Storage**: Custom table for storing form submissions
- **User Tracking**: Records user ID, IP address, and user agent
- **Export Functionality**: Export submissions to CSV format
- **Submission Details**: View detailed submission data in modal

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Run `npm install` in the plugin directory
3. Run `npm run build` to compile assets
4. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

### Creating a Form

1. Go to **Forms → Add New** in WordPress admin
2. Give your form a title
3. Click **Add Step** to create your first step
4. Add fields to your step by clicking **Add Field**
5. Configure each field's properties (label, placeholder, required, etc.)
6. Add more steps as needed
7. Configure form settings (button labels, success message)
8. Click **Save Form**

### Displaying a Form

Use the shortcode displayed in the sidebar:

```
[multi_step_form id="123"]
```

Replace `123` with your form ID.

### Displaying a Modal Trigger Button

Enable "Show Modal Trigger Button Shortcode" in the form settings, then use:

```
[multi_step_form_button id="123"]
```

Optional label:

```
[multi_step_form_button id="123" label="Open Form"]
```

Replace `123` with your form ID.

### Viewing Submissions

1. Go to **Forms → Submissions**
2. Select a form from the dropdown
3. View submission details or export to CSV

## Field Types

- **Text**: Single-line text input
- **Email**: Email address with validation
- **Textarea**: Multi-line text input
- **Select**: Dropdown menu
- **Radio**: Radio button group
- **Checkbox**: Checkbox group
- **Number**: Numeric input with min/max/step
- **Phone**: Phone number input
- **URL**: Website URL with validation
- **Date**: Date picker

## Development

### Build Commands

```bash
# Install dependencies
npm install

# Development build with watch
npm run dev

# Production build
npm run build
```

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Node.js 14+ (for development)

## License

GPL-2.0-or-later

## Author

JP Juliao
