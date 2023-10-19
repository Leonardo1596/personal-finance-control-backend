const Notification = require('../models/NotificationSchema');

const createNotification = async ({ userId, description, dueDate, date }) => {
    try {
        // Check if already exist the notification
        const existingNotification = await Notification.findOne({
            userId: userId
        });

        if (existingNotification) {
            console.log('a conta já existe');
            console.log(existingNotification);
        } else {
            const newNotification = new Notification({
                userId,
                description,
                dueDate,
                date
            });

            const savedNotification = await newNotification.save();
        }

    } catch (error) {
        console.error(error);
    }
};

const getNotifications = async (req, res) => {
    const userId = req.params;

    Notification.find(userId)
        .then(notifications => {
            return res.json(notifications);
        })
        .catch(error => {
            console.error(error);
        });
};

module.exports = {
    createNotification,
    getNotifications
};