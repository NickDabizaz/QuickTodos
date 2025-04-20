## Product Requirements Document (PRD)
### **QuickTodos: A Simple and Collaborative Todo List Application**

---

### **1. Product Objective and Description**

**QuickTodos** is a Todo List application that allows users to create and manage personal task lists within rooms accessible via a shared URL. Each user can create a todo list tied to a specific room, which can be accessed by anyone with the URL. Users can add, delete, and organize their tasks simply through a drag-and-drop system.

This application is designed for team collaboration without the need for login or registration. Each room has a unique URL that can be shared to access and collaborate on the task list.

---

### **2. Key Features**

#### **2.1 Landing Page**
- **Create Your Workspace**: Start instantly by creating your own collaborative room.
  - **Custom or Random**: Name your workspace something meaningful or get a randomly generated name with one click.
  - Share your unique workspace link with anyone — no sign-ups or logins needed.
- **Jump Back In**: Access any existing workspace by simply opening its URL (like `quicktodo.com/rocket-team`).

#### **2.2 Todo Management**
- **Todo Types**: Users can create Todo items with various customizable types. The default types are:
  - "Not Categorized" (mandatory)
  - "Coding"
  - "Design"
  - "Research"
  - "Marketing"
  - Users can add additional Todo types as needed for their room.

- **Todo Urgency/Status**:
  - Each Todo can be labeled with a color based on its urgency. The three categories are:
    - **Urgent** (Red)
    - **Normal** (Yellow)
    - **Low Priority** (Green)

  - **Sort Button**: A button is available to sort Todo items by status or name.

#### **2.3 Interaction with Todos**
- **Drag and Drop**:
  - Todos are displayed as cards that can be moved (dragged and dropped) within the same column.
  - Todo order can be changed anytime to adjust priorities without affecting the other automatic sorting rules.

- **Todo Sorting**:
  - Users can sort Todos by:
    - **Name**
    - **Urgency**
    - **Deadline** (if available)

#### **2.4 Collaboration**
- **Room Collaboration**:
  - Each room can be accessed by multiple users with the same URL.
  - Changes made by one user will be immediately visible to others accessing the same room.

---

### **3. Application Architecture**

#### **3.1 Data Storage**
- **Cloud Storage**:
  - All Todo data will be stored in the **cloud**, ensuring data persistence across sessions and devices.
  - Each room's data is tied to the unique room URL and can be accessed from any device with internet access.

#### **3.2 Rooms and URL**
- **Room Creation**:
  - Each room will have a unique URL generated from a random or custom name.
  - Users can access the room using the generated URL.

#### **3.3 UI and User Interaction**
- **Todo Cards**: Each Todo will be displayed in a card format with type, urgency, and interaction buttons (such as delete and edit).
- **Todo Column**: Each room will have a single column containing all Todos, with the order adjustable by the user.
- **Sort Button**: A sort button to allow users to reorder Todos.

---

### **4. Technical Specifications**

#### **4.1 Frontend**
- **React**: The application is built with React to ensure fast and dynamic interactivity.
- **Tailwind CSS**: Used for responsive design and styling of the UI.
- **React Router**: Used for page navigation and URL management.

#### **4.2 Backend**
- **Cloud Firestore or Supabase**: Used to store todos in real-time with multi-user access.

#### **4.3 Additional Functionalities**
- **Drag and Drop**: To move Todos within a column.
- **Sorting Button**: Users can press a button to sort Todos based on the selected category.

---

### **5. Development Roadmap**

1. **Phase 1: Basic Development**
   - Build the basic app structure and landing page.
   - Implement room creation with random and custom names.
   - Set up Todos with default categories.

2. **Phase 2: Collaboration Development**
   - Implement user collaboration within the same room.
   - Implement drag-and-drop and Todo sorting features.
   - Integrate cloud-based data persistence.

3. **Phase 3: Refinements and Feature Additions**
   - Add features for Todo urgency, auto-sorting, and sort buttons.
   - Conduct team testing to ensure all features work as intended.

---

### **6. Design Considerations**

- **Responsive Design**: The UI should be responsive across devices (desktop and mobile).
- **Data Persistence**: Data will be stored in the cloud, ensuring it is not lost between sessions.
- **Multi-User Sync**: Ensure real-time updates across users accessing the same room.

---

### **7. Estimated Time and Team**

- **Development Time**: Estimated development time is approximately 4-6 weeks, depending on complexity and testing.
- **Development Team**: The team will need 2-3 frontend developers skilled in React and Tailwind CSS, one backend developer (if using custom backend or Supabase), and one QA for testing.

---

### **8. Conclusion**

QuickTodos is a simple, easy-to-use Todo List application with team collaboration features based on room-based access. Without the need for login, it allows users to quickly create, manage, and share task lists effortlessly. With drag-and-drop functionality, sort buttons, and customizable categories, QuickTodos provides a flexible and responsive experience for users and teams.

---

