=== JPJuliao — Multi Step Form Builder ===
Contributors: jpjuliao
Tags: forms, multi-step, form builder, contact form, survey
Requires at least: 5.0
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.2.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A comprehensive multi-step form builder plugin with a drag-and-drop interface for creating beautiful, responsive forms.

== Description ==

Multi Step Form Builder allows you to create stunning multi-step forms with an intuitive drag-and-drop interface. Perfect for surveys, contact forms, registration forms, and any form that benefits from a step-by-step approach.

= Key Features =

* **Visual Form Builder** - React-based drag-and-drop interface
* **Form Layout** - Customizable form header with title and description
* **10 Field Types** - Text, email, textarea, select, radio, checkbox, number, phone, URL, and date
* **Step Management** - Add, remove, and reorder steps easily
* **Progress Indicator** - Beautiful progress bar showing form completion
* **Form Validation** - Client-side and server-side validation
* **Display Options** - Embed inline or display in a modal popup on page load
* **AJAX Submission** - No page reload on form submission
* **Submissions Management** - View, export (CSV), and delete form submissions
* **Responsive Design** - Mobile-friendly forms with smooth animations
* **Customizable** - Configure button labels, success messages, modal delay, and more

= Field Types =

1. Text - Single-line text input
2. Email - Email address with validation
3. Textarea - Multi-line text input
4. Select - Dropdown menu
5. Radio - Radio button group
6. Checkbox - Multiple selection checkboxes
7. Number - Numeric input with min/max/step
8. Phone - Telephone number
9. URL - Website URL with validation
10. Date - Date picker

= Perfect For =

* Contact forms
* Survey forms
* Registration forms
* Order forms
* Quote request forms
* Application forms
* Feedback forms
* Multi-page questionnaires

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/multi-step-form-builder` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to Forms → Add New to create your first form.
4. Use the shortcode `[multi_step_form id="X"]` to display your form on any page or post.

= Building Assets (For Developers) =

If you're installing from source:

1. Navigate to the plugin directory
2. Run `npm install`
3. Run `npm run build`

== Frequently Asked Questions ==

= How do I create a form? =

1. Go to Forms → Add New in your WordPress admin
2. Give your form a title
3. Click "Add Step" to create steps
4. Click "Add Field" to add fields to each step
5. Configure field properties
6. Click "Save Form"
7. Copy the shortcode and add it to any page

= How do I display a form on my website? =

Use the shortcode displayed in the form editor sidebar:
`[multi_step_form id="123"]`

Replace 123 with your form ID.

= Can I show a button that opens the form in a popup? =

Yes. Enable "Show Modal Trigger Button Shortcode" in the Form Settings and use:

`[multi_step_form_button id="123"]`

You can also set a button label:

`[multi_step_form_button id="123" label="Open Form"]`

= Can I export form submissions? =

Yes! Go to Forms → Submissions, select your form, and click "Export to CSV" to download all submissions.

= Is the plugin mobile-friendly? =

Absolutely! All forms are fully responsive and work beautifully on mobile devices, tablets, and desktops.

= Can I customize the button text? =

Yes, you can customize the Next, Previous, and Submit button text in the form settings panel.

= Does it work with page builders? =

Yes! The shortcode works with all major page builders including Elementor, Beaver Builder, Divi, and others.

= Can I make fields required? =

Yes, each field has a "Required" toggle that you can enable to make it mandatory.

= Can I show the form in a popup? =

Yes, you can enable "Show in Modal on Page Load" in the Form Settings to automatically display the form in a popup when the page loads. You can also set a delay in seconds.

== Screenshots ==

1. Form builder interface with drag-and-drop functionality
2. Field configuration panel
3. Frontend multi-step form with progress indicator
4. Submissions management page
5. Mobile-responsive form display

== Changelog ==

= 1.1.1 =
* **Display Conditions**:
    *   Added a modal trigger button shortcode and setting to open forms on click.

= 1.1.0 =
* **Performance & Architecture**:
    *   Implemented **Code Splitting** using `React.lazy` and `Suspense` to reduce initial bundle size for both Admin and Frontend.
    *   Added **Dynamic Imports** in entry points (`src/admin/index.js`, `src/frontend/index.js`) to load chunks on demand.
* **Frontend Refactoring (`src/frontend`)**:
    *   **Architecture**: Adopted a Service-Repository pattern for API calls (`services/api.js`) and Custom Hooks for logic separation.
    *   **Custom Hooks**: Created `useFormConfig` for data fetching and `useMultiStepForm` for form state management.
    *   **Component Composition**: Decomposed `MultiStepForm.js` into single-responsibility components: `StepContent`, `FormNavigation`, `FormFeedback`, and `Spinner`.
    *   **Dependency Optimization**: Removed heavy `@wordpress/components` dependency; implemented lightweight local `Spinner` using existing CSS.
* **Admin Refactoring (`src/admin`)**:
    *   **Component Decomposition**: Refactored monolithic `StepEditor.js` into composed children: `StepHeader`, `StepFieldsList`, and `StepFieldAdder`.
    *   **Optimization**: Applied lazy loading to Admin tabs and heavy editor components.

= 1.0.0 =
* Initial release
* Visual form builder with React
* 10 field types
* Multi-step navigation
* Progress indicator
* Form validation
* AJAX submission
* Submissions management
* CSV export
* Responsive design

== Upgrade Notice ==

= 1.0.0 =
Initial release of Multi Step Form Builder.

== Additional Information ==

= Support =

For support, please visit the plugin support forum.

= Development =

This plugin is actively developed. For feature requests or bug reports, please use the support forum.

= Credits =

Developed by JP Juliao
