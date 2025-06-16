class Coupon {
  constructor({ id = null, code, discountPercentage, expirationDate }) {
    this.id = id ?? null;
    this.code = code;
    this.discountPercentage = Number(discountPercentage);
    this.expirationDate = new Date(expirationDate);
  }

  validate() {
    if (!this.code || typeof this.code !== 'string' || this.code.trim().length === 0) {
      throw new Error('O código do cupom é obrigatório.');
    }
    if (
      typeof this.discountPercentage !== 'number' ||
      isNaN(this.discountPercentage) ||
      this.discountPercentage <= 0 ||
      this.discountPercentage > 100
    ) {
      throw new Error('A porcentagem de desconto deve ser um número entre 1 e 100.');
    }

    // Validação da data
    if (!(this.expirationDate instanceof Date) || isNaN(this.expirationDate.getTime())) {
      throw new Error('A data de expiração deve ser uma data válida.');
    }

    const now = new Date();
    if (this.expirationDate <= now) {
      throw new Error('A data de expiração deve ser uma data futura.');
    }
  }
}

module.exports = Coupon;
