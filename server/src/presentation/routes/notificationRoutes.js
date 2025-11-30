const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');

// Dependencies
const MongooseNotificationRepository = require('../../infrastructure/repositories/MongooseNotificationRepository');
const CreateNotification = require('../../application/use_cases/notification/CreateNotification');
const GetNotifications = require('../../application/use_cases/notification/GetNotifications');
const MarkNotificationRead = require('../../application/use_cases/notification/MarkNotificationRead');
const DeleteNotification = require('../../application/use_cases/notification/DeleteNotification');
const NotificationController = require('../controllers/NotificationController');

// Instantiate dependencies
const notificationRepository = new MongooseNotificationRepository();
const createNotification = new CreateNotification(notificationRepository);
const getNotifications = new GetNotifications(notificationRepository);
const markNotificationRead = new MarkNotificationRead(notificationRepository);
const deleteNotification = new DeleteNotification(notificationRepository);

// Instantiate Controller
const notificationController = new NotificationController(
  createNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification
);

// Define Routes
router.post('/', authMiddleware, (req, res) => notificationController.create(req, res));
router.get('/', authMiddleware, (req, res) => notificationController.getAll(req, res));
router.put('/read-all', authMiddleware, (req, res) => notificationController.markAllRead(req, res));
router.put('/:id/read', authMiddleware, (req, res) => notificationController.markRead(req, res));
router.delete('/:id', authMiddleware, (req, res) => notificationController.delete(req, res));

module.exports = router;
