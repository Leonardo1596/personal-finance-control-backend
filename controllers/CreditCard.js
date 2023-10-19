const CreditCardSchema = require('../models/CreditCardSchema');

const createCreditCard = async (req, res) => {
    try {
        const { userId, cardName, creditLimit } = req.body;
    
        const newCard = new CreditCardSchema({
          userId,
          cardName,
          creditLimit
        });
    
        const savedCard = await newCard.save();
    
        res.status(201).json(savedCard);
      } catch (error) {
        res.status(500).json({ error: 'Ocorreu um erro ao criar o cartão.' });
      }
};

module.exports = {
    createCreditCard,
};