const { v4: uuidv4 } = require('uuid');

class TradeCoupon {
  constructor({userId, value }) {
    console.log(userId);
    console.log(value);

    this.userId = userId;
    this.code = uuidv4();
    this.value = Number(value);
    this.validate();
  }

  validate() {
    if (!this.userId || typeof this.userId !== 'number' || this.userId <= 0) {
      throw new Error('O ID do usuário é obrigatório e deve ser um número válido.');
    }

    if (!this.code || typeof this.code !== 'string' || this.code.trim().length === 0) {
      throw new Error('O código do cupom é obrigatório.');
    }

    if (isNaN(this.value) || this.value <= 0) {
      throw new Error('O valor do cupom deve ser um número positivo.');
    }
  }
}

module.exports = TradeCoupon;
