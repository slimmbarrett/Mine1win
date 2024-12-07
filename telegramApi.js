import config from './config.js';

class TelegramAPI {
    static getChannelId(channelUrl) {
        // Extract channel ID from URL
        const match = channelUrl.match(/t\.me\/\+(.+)$/);
        return match ? match[1] : channelUrl;
    }

    static async checkSubscription(username) {
        try {
            const channelId = this.getChannelId(config.CHANNEL_USERNAME);
            const response = await fetch(`${config.TELEGRAM_API_URL}/bot${config.BOT_TOKEN}/getChatMember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: channelId,
                    user_id: username
                })
            });

            const data = await response.json();
            
            if (!data.ok) {
                throw new Error('Failed to check subscription');
            }

            // Статусы участника канала
            const validStatuses = ['creator', 'administrator', 'member'];
            return validStatuses.includes(data.result.status);
        } catch (error) {
            console.error('Error checking subscription:', error);
            return false;
        }
    }

    static async getTelegramUserInfo(username) {
        try {
            const response = await fetch(`${config.TELEGRAM_API_URL}/bot${config.BOT_TOKEN}/getChat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: username
                })
            });

            const data = await response.json();
            return data.ok ? data.result : null;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }
}

export default TelegramAPI;
