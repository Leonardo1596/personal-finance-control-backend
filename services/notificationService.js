const cron = require('node-cron');
const NotificationSchema = require('../models/NotificationSchema');
const Notification = require('../controllers/Notification'); // Importe sua função de criação de notificação
const BillToPay = require('../models/BillToPay');

function start() {
  async function findAccountsWithUpcomingDueDates() {
    const today = new Date(); // Obtenha a data atual

    // Defina um limite de dias para considerar como "próximo". Por exemplo, 7 dias a partir de hoje.
    const daysAhead = 7;

    // Calcule a data limite (hoje + daysAhead)
    const limitDate = new Date(today);
    limitDate.setDate(today.getDate() + daysAhead);

    // Consulte o banco de dados para encontrar contas com datas de vencimento dentro do intervalo
    const accountsToNotify = await BillToPay.find({
      // userId: userIdToSearch, // Filtra com base no ID do usuário
      date: { $gte: today.toISOString().split('T')[0], $lte: limitDate.toISOString().split('T')[0] },
    });

    return accountsToNotify;
  }


  // Execute a tarefa agendada todos os dias à meia-noite
  cron.schedule('0 0 * * *', async () => {
    try {
      // Implemente a lógica para encontrar contas com datas de vencimento próximas
      const accountsToNotify = await findAccountsWithUpcomingDueDates();

      // Para cada conta encontrada, crie uma notificação
      for (const account of accountsToNotify) {
        await Notification.createNotification({
          userId: account.userId,
          description: `Lembrete: A conta "${account.description}" vence em breve.`,
          dueDate: account.date,
          date: new Date(),
        });
      }

      console.log('Tarefa agendada executada com sucesso.');
    } catch (error) {
      console.error('Ocorreu um erro durante a execução da tarefa agendada:', error);
    }
  });

}



module.exports = {
  start
}