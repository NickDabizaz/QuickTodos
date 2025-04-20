# QuickTodos Design System

## Brand Identity

QuickTodos is a lightweight, collaborative task management system focused on simplicity and instant accessibility. The brand emphasizes efficiency, collaboration, and ease of use without unnecessary complexity.

### Core Values
- **Simplicity**: Intuitive interfaces with minimal learning curve
- **Collaboration**: Instant sharing and team-oriented features
- **Efficiency**: Quick setup and optimized workflows
- **Privacy**: Browser-based storage with no server requirements

## Color System

### Primary Colors
- **Indigo**: `#4f46e5` (indigo-600)
  - Hover: `#4338ca` (indigo-700)
  - Light: `#e0e7ff` (indigo-100)
  - Used for: Primary buttons, brand elements, hero gradient

- **Purple**: `#9333ea` (purple-600)
  - Light: `#f3e8ff` (purple-100)
  - Used for: Hero gradient, complementary elements

### Secondary & Accent Colors
- **Green**: `#10b981` (green-500)
  - Light: `#d1fae5` (green-100)
  - Used for: Success states, completed tasks, category tags

- **Red**: `#ef4444` (red-500)
  - Light: `#fee2e2` (red-100)
  - Used for: Error states, urgent tasks, validation messages

- **Blue**: `#3b82f6` (blue-500)
  - Light: `#dbeafe` (blue-100)
  - Used for: Research category, links, icon backgrounds

- **Yellow**: `#eab308` (yellow-500)
  - Light: `#fef3c7` (yellow-100)
  - Used for: Ratings, smart sorting icon

### Neutrals
- **White**: `#ffffff`
- **Gray-50**: `#f9fafb` (card backgrounds, alternate section backgrounds)
- **Gray-100**: `#f3f4f6` (borders, subtle backgrounds)
- **Gray-200**: `#e5e7eb` (button backgrounds, dividers)
- **Gray-400**: `#9ca3af` (secondary text, footer text)
- **Gray-600**: `#4b5563` (primary text, navigation links)
- **Gray-800**: `#1f2937` (headings, footer)
- **Gray-900**: `#111827` (bold text, modal headings)

## Typography

### Font Family
- Primary: Inter (sans-serif)

### Font Weights
- Regular: 400 (body text)
- Medium: 500 (form labels, navigation)
- Semibold: 600 (feature headings, secondary buttons)
- Bold: 700 (buttons, section headings)
- Extrabold: 800 (hero heading)

### Text Sizes
- XS: `0.75rem` (12px) - Meta information, button labels
- SM: `0.875rem` (14px) - Helper text, form labels
- Base: `1rem` (16px) - Body text
- LG: `1.125rem` (18px) - Large buttons, sub-headings
- XL: `1.25rem` (20px) - Section headings, modal titles
- 2XL: `1.5rem` (24px) - Brand name
- 3XL: `1.875rem` (30px) - Section headlines
- 4XL: `2.25rem` (36px) - Mobile hero heading
- 5XL: `3rem` (48px) - Desktop hero heading

## UI Components

### Cards

#### Standard Card
```html
<div className="bg-white p-6 rounded-lg shadow-md">
  <!-- Content here -->
</div>
```

#### Feature Card
```html
<div className="bg-white p-6 rounded-lg shadow-md">
  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
    <Icon className="h-6 w-6 text-indigo-600" />
  </div>
  <h3 className="text-xl font-semibold mb-2 text-gray-800">Feature Title</h3>
  <p className="text-gray-600">
    Feature description text goes here.
  </p>
</div>
```

#### Testimonial Card
```html
<div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
  <div className="flex items-center mb-4">
    <Star className="h-5 w-5 text-yellow-500 mr-1" />
    <!-- Repeat for 5 stars -->
  </div>
  <p className="text-gray-600 mb-4">
    "Testimonial text goes here."
  </p>
  <p className="font-medium text-gray-800">- Name, Title</p>
</div>
```

### Buttons

#### Primary Button
```html
<button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition">
  Button Text
</button>
```

#### Hero Button (with icon)
```html
<button className="flex items-center bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold text-lg transition transform hover:scale-105">
  <Icon className="mr-2 h-5 w-5" />
  Button Text
</button>
```

#### Utility Button
```html
<button className="text-gray-400 hover:text-gray-600">
  <Icon className="h-6 w-6" />
</button>
```

#### Small Button
```html
<button className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded flex items-center">
  <Icon className="h-3 w-3 mr-1" /> Button Text
</button>
```

### Feature Icons
```html
<div className="w-12 h-12 bg-[color]-100 rounded-full flex items-center justify-center mb-4">
  <Icon className="h-6 w-6 text-[color]-600" />
</div>
```

### Navigation
```html
<nav className="bg-white border-b shadow-sm p-4 px-6 md:px-10">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <!-- Logo -->
    <div className="flex items-center">
      <span className="text-2xl font-bold text-indigo-600">QuickTodos</span>
    </div>
    <!-- Links -->
    <div className="hidden md:flex items-center space-x-8">
      <a href="#section" className="text-gray-600 hover:text-indigo-600">Link Text</a>
    </div>
    <!-- CTA Button -->
    <div>
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition">
        CTA Text
      </button>
    </div>
  </div>
</nav>
```

### Form Elements

#### Input Fields
```html
<input
  type="text"
  id="inputId"
  className="w-full px-3 py-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
  placeholder="Placeholder text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### Input Error State
```html
<input
  type="text"
  id="inputId"
  className="w-full px-3 py-2 border border-red-300 bg-red-50 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 text-gray-900"
  placeholder="Placeholder text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

#### Input Label
```html
<label htmlFor="inputId" className="block text-sm font-medium text-gray-900 mb-1">
  Label Text
</label>
```

#### Helper Text
```html
<p className="text-sm text-gray-500">
  Helper text goes here
</p>
```

#### Error Tooltip
```html
<div className="absolute right-3 top-2.5 text-red-500 cursor-help group">
  <Info className="h-5 w-5" />
  <div className="hidden group-hover:block absolute right-0 top-7 bg-white p-2 rounded shadow-lg border border-red-200 text-xs w-60 z-10">
    Error message goes here
  </div>
</div>
```

### Task Items

#### Task Item Layout
```html
<div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
  <div className="flex items-center">
    <!-- Checkbox or completion indicator -->
    <span className="text-gray-700">Task text</span>
  </div>
  <span className="px-2 py-1 bg-[color]-100 text-[color]-800 text-xs rounded-full">Category</span>
</div>
```

#### Task Categories
- Design: `bg-green-100 text-green-800`
- Urgent: `bg-red-100 text-red-800`
- Research: `bg-blue-100 text-blue-800`

## Modal Design

### Modal Structure
```html
<div className="fixed inset-0 flex items-center justify-center" style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
  <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
    <!-- Close button -->
    <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
      <X className="h-6 w-6" />
    </button>
    
    <h3 className="text-xl font-bold text-gray-900 mb-4">Modal Title</h3>
    
    <!-- Modal content -->
    
    <!-- Modal action -->
    <div className="flex justify-center">
      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition w-full">
        Action Button
      </button>
    </div>
  </div>
</div>
```

## Layout & Spacing

### Page Structure
```html
<div className="min-h-screen flex flex-col">
  <nav><!-- Navigation --></nav>
  <section><!-- Hero Section --></section>
  <section><!-- Content Sections --></section>
  <footer><!-- Footer --></footer>
</div>
```

### Section Layout
```html
<section className="py-16 bg-[color]">
  <div className="max-w-7xl mx-auto px-6 md:px-10">
    <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Section Title</h2>
    <p className="text-xl text-center mb-12 text-gray-600">Section description</p>
    
    <!-- Section content -->
  </div>
</section>
```

### Grid Layouts
```html
<div className="grid md:grid-cols-3 gap-8">
  <!-- Grid items -->
</div>
```

### Two-Column Layout
```html
<div className="flex flex-col md:flex-row items-center">
  <div className="md:w-1/2 mb-10 md:mb-0">
    <!-- Left column content -->
  </div>
  <div className="md:w-1/2 md:pl-10">
    <!-- Right column content -->
  </div>
</div>
```

## Responsive Design

### Key Breakpoints
- Mobile: Default styles
- Tablet/Small Desktop: `md:` (768px)
- Large Desktop: `lg:` (1024px)

### Mobile-First Patterns
- Stack to horizontal: `flex-col md:flex-row`
- Grid column adjustment: `grid md:grid-cols-3`
- Font size scaling: `text-4xl md:text-5xl`
- Margin/padding adjustments: `mb-10 md:mb-0`
- Hide/show elements: `hidden md:flex`

## Animation & Interaction

### Hover Effects
- Button hover: `hover:bg-indigo-700`
- Link hover: `hover:text-indigo-600`
- Scale on hover: `transition transform hover:scale-105`

### Focus States
- Input focus: `focus:outline-none focus:ring-2 focus:ring-indigo-500`

### Transitions
- Smooth transitions: `transition`

## Accessibility

### Color Contrast
- Dark text on light backgrounds
- White text on colored backgrounds
- Supporting text at appropriate opacity

### Focus Indicators
- Visible focus rings on interactive elements

### Text Alternatives
- Icons paired with text labels
- Tooltips for additional context

## Icons
Using Lucide React icons with standardized sizing:
- Large icons: `h-6 w-6` (navigation, feature icons)
- Medium icons: `h-5 w-5` (inline icons)
- Small icons: `h-4 w-4` and `h-3 w-3` (utility icons)

## Best Practices

1. **Consistency**: Maintain consistent spacing, typography, and color usage
2. **Hierarchy**: Use size, weight, and color to establish content hierarchy
3. **Whitespace**: Allow content to breathe with appropriate spacing
4. **Feedback**: Provide clear visual feedback for interactive elements
5. **Accessibility**: Ensure sufficient contrast and provide text alternatives
6. **Responsive Design**: Build mobile-first and enhance for larger screens
7. **Performance**: Optimize images and animations for smooth performance 