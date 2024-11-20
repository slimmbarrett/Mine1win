import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Updater, CommandHandler, CallbackContext

# Загрузка токена из переменной окружения для безопасности
BOT_TOKEN = os.getenv('7537994303:AAG15uJYwAmzVINLchNmzIjZ7So95RdkpdI')

# URL вашего Web App
WEB_APP_URL = 'https://prod-rnd-frontend-php.100hp.app/mines/?exitUrl=https%253A%252F%252F1win.com%252Fcasino&language=en&b=demo'

def start(update: Update, context: CallbackContext) -> None:
    """Обработчик команды /start"""
    # Кнопка с веб-приложением
    keyboard = [
        [InlineKeyboardButton("Начать игру", web_app={"url": WEB_APP_URL})]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Отправляем приветственное сообщение с кнопкой
    update.message.reply_text(
        'Добро пожаловать в MineGames! Нажмите кнопку, чтобы начать игру.',
        reply_markup=reply_markup
    )

def main() -> None:
    """Основная функция для запуска бота"""
    # Получаем токен из переменной окружения
    if BOT_TOKEN is None:
        print("Ошибка: Не указан BOT_TOKEN в переменных окружения!")
        return

    # Создаем экземпляр бота и передаем токен
    updater = Updater(BOT_TOKEN)

    # Получаем диспетчера для регистрации обработчиков
    dispatcher = updater.dispatcher

    # Обрабатываем команду /start
    dispatcher.add_handler(CommandHandler('start', start))

    # Запускаем бота
    try:
        updater.start_polling()
        updater.idle()
    except Exception as e:
        print(f"Ошибка при запуске бота: {e}")

if __name__ == '__main__':
    main()
