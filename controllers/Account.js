const AccountSchema = require('../models/AccountSchema');
const Transaction = require('../models/TransactionSchema');
const User = require('../models/UserSchema');

const createAccount = async (req, res) => {
  try {
    const { userId, accountName } = req.body;

    // Cria uma nova instância do modelo Account com os dados fornecidos
    const newAccount = new AccountSchema({
      userId,
      accountName,
      balance: '0,00'
    });

    // Salva a nova conta no banco de dados
    const savedAccount = await newAccount.save();

    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao criar a conta.' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { userId, accountId } = req.params;

    const accounts = await AccountSchema.find({ userId: userId });

    if (accounts.length === 1) {
      return res.json({ error: 'Você não pode excluir sua única conta' });
    }

    const deletedAccount = await AccountSchema.findOneAndDelete({
      userId,
      _id: accountId,
    });

    if (!deletedAccount) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }



    // Remove todas as transações associadas à conta
    await Transaction.deleteMany({ accountId });

    return res.json({ message: 'Conta excluída com sucesso' });

  } catch (error) {

  }
};

const updateAccount = async (req, res) => {
  try {
    const { userId, accountId } = req.params;
    const { accountName, balance } = req.body;

    const updatedAccount = await AccountSchema.findOneAndUpdate(
      { userId, _id: accountId },
      { accountName, balance },
      { new: true }
    );

    if (!updatedAccount) {
      return res.status(404).json({ error: 'Conta não encontrada' });
    }

    res.json(updatedAccount);

  } catch (error) {

  }
};

const getAccountsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Busca todas as contas associadas ao usuário fornecido
    const accounts = await AccountSchema.find({ userId });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao obter as contas.' });
  }
};

module.exports = {
  createAccount,
  deleteAccount,
  updateAccount,
  getAccountsByUser
};