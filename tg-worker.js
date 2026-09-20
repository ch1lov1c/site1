/**
 * Cloudflare Worker - прокси для отправки заявок с GitHub Pages в Telegram
 * Бесплатно, скрывает токен бота
 * 
 * Инструкция:
 * 1. Создай Worker на dash.cloudflare.com
 * 2. Вставь этот код
 * 3. Замени BOT_TOKEN и CHAT_ID ниже
 * 4. Deploy
 */

const BOT_TOKEN = '8455891582:AAHa7tywuX6bS0qmIP9xLqg34cHJEf7Yo24' // например 123456:AAH...
const CHAT_ID = '2070652553' // например 123456789 или -100...

export default {
  async fetch(request, env, ctx) {
    // Разрешаем CORS только с твоего домена (можешь поставить * для теста)
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // поменяй на 'https://guesthomevlg.ru' после теста
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    try {
      const data = await request.json()

      // Простая антиспам проверка - honeypot
      if (data.website) {
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      // Формируем красивое сообщение
      const text = `🔥 <b>Новая заявка с guesthomevlg.ru</b>

👥 <b>Гостей:</b> ${escapeHtml(data.guests || '-')}
📅 <b>Даты:</b> ${escapeHtml(data.dates || '-')} (${data.nights || '?'} ночей)
🏠 <b>Номер:</b> ${escapeHtml(data.room || '-')}
🚗 <b>Допы:</b> ${escapeHtml((data.extras || []).join(', ') || 'нет')}

💰 <b>Ориентир:</b> ${escapeHtml(data.price || '-')} 

👤 <b>Имя:</b> ${escapeHtml(data.name || '-')}
📞 <b>Телефон:</b> ${escapeHtml(data.phone || '-')}
💬 <b>Коммент:</b> ${escapeHtml(data.comment || '-')}

🌐 Страница: ${escapeHtml(data.page || 'guesthomevlg.ru')}
#заявка`

      // Отправляем в Telegram
      const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'HTML'
        })
      })

      const tgData = await tgRes.json()

      if (!tgData.ok) {
        console.error('TG error', tgData)
        return new Response(JSON.stringify({ ok: false, error: tgData.description }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })

    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}

function escapeHtml(str) {
  if (!str) return ''
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
