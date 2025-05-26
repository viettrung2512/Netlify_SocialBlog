import { useState, useEffect, useRef } from "react"
import "./Notification.css"

/**
 * @typedef {Object} Notification
 * @property {string} _id
 * @property {string} title
 * @property {string} message
 * @property {boolean} read
 * @property {string} [date]
 * @property {string} [postId]
 */

/**
 * @typedef {Object} Notification
 * @property {string} _id
 * @property {string} title
 * @property {string} message
 * @property {boolean} read
 * @property {string} [date]
 * @property {string} [postId]
 */

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false)
  /** @type {[Notification[], Function]} */
  const [notifications, setNotifications] = useState([])
  /** @type {import('react').RefObject<HTMLDivElement>} */
  const dropdownRef = useRef(null)

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`/api/notifications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      } else {
        const errorData = await response.json()
        console.error("Lỗi khi lấy thông báo:", errorData.message)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const toggleDropdown = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === id ? { ...notification, read: true } : notification,
          ),
        )
        const data = await response.json()
        if (data.postId) window.location.href = `/blog/${data.postId}`
      } else {
        const errorData = await response.json()
        console.error("Lỗi khi đánh dấu thông báo là đã đọc:", errorData.message)
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`/api/notifications/read-all`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        )
      } else {
        const errorData = await response.json()
        console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", errorData.message)
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Helper function to format date if available
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <div className="notification-container">
      <button onClick={toggleDropdown} className="notification-bell" aria-label="Notifications">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {notifications.some((n) => !n.read) && (
              <button
                className="mark-all-read"
                onClick={(e) => {
                  e.stopPropagation()
                  markAllAsRead()
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-divider"></div>

          <div className="notification-content">
            {notifications.length > 0 ? (
              <ul className="notification-list">
                {notifications.map((notification) => (
                  <li
                    key={notification._id}
                    className={`notification-item ${!notification.read ? "unread" : ""}`}
                    onClick={() => markAsRead(notification._id)}
                  >
                    <div className="notification-item-content">
                      <img
                        src={notification.profilePicture || "https://images.spiderum.com/sp-xs-avatar/c3edf44040da11e88c56e97b1d97fbce.png"}
                        alt="User avatar"
                        className="notification-avatar"
                      />
                      <div className="notification-text">
                        <p className="notification-title">{notification.title}</p>
                        <span className="notification-date">
                          {notification.date ? formatDate(notification.date) : notification.message}
                        </span>
                      </div>
                      {!notification.read && <div className="unread-indicator"></div>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-notifications">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="empty-icon"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <p className="empty-text">No notifications yet</p>
                <p className="empty-subtext">Well notify you when something important happens</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
