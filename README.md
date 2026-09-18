# Gourmet Haven - Restaurant Table Booking System

A modern, responsive web application for restaurant table reservations with user authentication and admin dashboard.

## Project Structure

```
/
├── public/
│   ├── css/
│   │   └── styles.css          # Custom CSS styles and animations
│   └── js/
│       └── app.js              # Main application JavaScript
├── src/
│   └── index.html              # Main HTML file
├── BOOKINGS.HTML               # Original single-file version
└── README.md                   # Project documentation
```

## Features

### User Features
- **User Registration & Login**: Create accounts and sign in securely
- **Table Reservations**: Book tables with date, time, guest count, and preferences
- **Real-time Availability**: Check table availability and make reservations
- **User Dashboard**: View and manage personal reservations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Admin Features
- **Admin Dashboard**: Complete overview of all reservations
- **Booking Management**: View, confirm, cancel, and delete reservations
- **User Management**: Monitor registered users
- **Data Export**: Export booking data to CSV
- **Statistics**: Real-time stats on bookings and users
- **Quick Actions**: Clear old bookings, generate reports

### Technical Features
- **Local Storage**: Data persistence using browser localStorage
- **Modern UI**: Built with Tailwind CSS and Font Awesome icons
- **Form Validation**: Client-side validation for all forms
- **Toast Notifications**: User-friendly success/error messages
- **Single Page Application**: Smooth page transitions without reloads

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styles with Tailwind CSS framework
- **JavaScript (ES6+)**: Modern JavaScript with classes and modules
- **Tailwind CSS**: Utility-first CSS framework
- **Font Awesome**: Icon library
- **LocalStorage API**: Client-side data storage

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required - runs entirely in the browser

### Installation

1. **Clone or Download** the project files
2. **Open** `src/index.html` in your web browser
3. **Start using** the application immediately!

### Alternative: Run from Original File
- Open `BOOKINGS.HTML` directly in your browser for the single-file version

## Usage

### For Customers
1. **Register** a new account or **Login** if you already have one
2. **Navigate** to the Reservation page
3. **Fill out** the booking form with your details
4. **Submit** to confirm your reservation
5. **Receive** confirmation via toast notification

### For Admins
1. **Register** as an admin user (check "Register as Restaurant Admin")
2. **Login** with your admin credentials
3. **Access** the Admin Dashboard
4. **Manage** reservations, view statistics, and export data

## File Structure Details

### `src/index.html`
- Main HTML structure
- Contains all page layouts (Home, Login, Register, Reservation, Admin)
- Links to external CSS and JavaScript files
- Uses Tailwind CSS for styling

### `public/css/styles.css`
- Custom CSS animations and styles
- Page transition effects
- Hover effects and responsive adjustments
- Keyframe animations for toast notifications

### `public/js/app.js`
- `RestaurantDB` class: Handles all data operations
- User authentication and session management
- Booking creation, retrieval, and management
- Admin dashboard functionality
- Form handling and validation
- UI state management

## Data Storage

The application uses browser localStorage for data persistence:
- **Users**: Registered user accounts with authentication
- **Bookings**: Reservation data with all details
- **Current User**: Active user session information

**Note**: Data is stored locally in the browser and will persist between sessions.

## Browser Compatibility

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Development

### Adding New Features
1. Modify `src/index.html` for new UI elements
2. Add styles to `public/css/styles.css`
3. Implement functionality in `public/js/app.js`

### Customization
- **Colors**: Modify Tailwind config in `src/index.html`
- **Styling**: Update `public/css/styles.css`
- **Functionality**: Extend the `RestaurantDB` class in `public/js/app.js`

## Future Enhancements

- [ ] Backend API integration
- [ ] Database storage (MongoDB, PostgreSQL)
- [ ] Email notifications
- [ ] Payment integration
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues:
- Check the browser console for errors
- Ensure JavaScript is enabled
- Clear browser cache if experiencing issues

---

**Built with ❤️ for restaurant management**
