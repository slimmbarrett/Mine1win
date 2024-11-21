import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo, Update
from telegram.ext import Updater, CommandHandler, CallbackContext
import logging

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Ваш токен API
BOT_TOKEN = '7537994303:AAG15uJYwAmzVINLchNmzIjZ7So95RdkpdI'

# URL вашего Web App
WEB_APP_URL = 'https://mine1win.vercel.app/'

def start(update: Update, context: CallbackContext) -> None:
    """Обработчик команды /start"""
    # Кнопка с веб-приложением
    keyboard = [
        [InlineKeyboardButton("Начать игру", web_app=WebAppInfo(url=WEB_APP_URL))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Отправляем приветственное сообщение с кнопкой
    update.message.reply_text(
        'Добро пожаловать в MineGames! Нажмите кнопку, чтобы начать игру.',
        reply_markup=reply_markup
    )

def main() -> None:
    """Основная функция для запуска бота"""
    # Проверяем наличие токена
    if not BOT_TOKEN:
        logging.error("Ошибка: Токен бота не указан!")
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
        logging.error(f"Ошибка при запуске бота: {e}")

if __name__ == '__main__':
    main()
